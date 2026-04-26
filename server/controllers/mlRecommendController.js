// server/controllers/mlRecommendController.js
// Proxies to Python Flask ML service and runs Haversine cluster selection
const fs   = require('fs');
const path = require('path');
const csv  = require('csv-parser');

// ─── CSV helpers ──────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, '../../python-ml/data');

function loadCSV(filename) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(path.join(DATA_DIR, filename))
            .pipe(csv())
            .on('data', d => results.push(d))
            .on('end',  () => resolve(results))
            .on('error', reject);
    });
}

// ─── Haversine distance (km) ──────────────────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ─── How many clusters for N days ────────────────────────────────────────────
function getClusterCount(days) {
    if (days <= 2) return 1;
    if (days <= 4) return 2;
    if (days <= 8) return 3;
    return 4;
}

// ─── Top 10 places for a cluster ─────────────────────────────────────────────
function getTopPlaces(clusterName, placesData) {
    return placesData
        .filter(p => p.Cluster_Name === clusterName)
        .sort((a, b) => parseFloat(b.Rating) - parseFloat(a.Rating))
        .slice(0, 10)
        .map(p => ({
            place_id:          p.Place_ID,
            place:             p.Place_Name,
            city:              p.City,
            province:          p.Province,
            category:          p.Category,
            lat:               parseFloat(p.Latitude),
            lon:               parseFloat(p.Longitude),
            terrain:           p.Terrain_Type,
            time_needed:       parseFloat(p['Time_Needed (H)'] || 0),
            rating:            parseFloat(p.Rating),
            cluster_id:        p.Cluster_ID,
            cluster:           p.Cluster_Name,
        }));
}

// ─── Select best clusters using Haversine proximity ──────────────────────────
function selectBestClusters(rankedClusters, locationMap, totalDays) {
    const k = getClusterCount(totalDays);
    const candidates = rankedClusters
        .slice(0, 10)
        .map(c => ({ ...c, ...(locationMap[c.cluster] || {}) }))
        .filter(c => c.lat && c.lon);

    if (candidates.length === 0) return [];
    const selected = [candidates[0]];

    while (selected.length < k && selected.length < candidates.length) {
        let bestCandidate = null, bestDist = Infinity;
        for (const cand of candidates) {
            if (selected.find(s => s.cluster === cand.cluster)) continue;
            const minDist = Math.min(...selected.map(s => haversine(s.lat, s.lon, cand.lat, cand.lon)));
            if (minDist < bestDist) { bestDist = minDist; bestCandidate = cand; }
        }
        if (bestCandidate) selected.push(bestCandidate); else break;
    }
    return selected;
}

// ─── 2 suggestion clusters ────────────────────────────────────────────────────
function getSuggestions(rankedClusters, locationMap, selectedClusters) {
    const candidates = rankedClusters
        .slice(0, 10)
        .map(c => ({ ...c, ...(locationMap[c.cluster] || {}) }))
        .filter(c => c.lat && c.lon && !selectedClusters.find(s => s.cluster === c.cluster));

    const suggestions = [];
    const remaining = [...candidates];

    while (suggestions.length < 2 && remaining.length > 0) {
        let bestCandidate = null, bestDist = Infinity;
        for (const cand of remaining) {
            const minDist = Math.min(...selectedClusters.map(s => haversine(s.lat, s.lon, cand.lat, cand.lon)));
            if (minDist < bestDist) { bestDist = minDist; bestCandidate = cand; }
        }
        if (bestCandidate) {
            suggestions.push(bestCandidate);
            remaining.splice(remaining.findIndex(c => c.cluster === bestCandidate.cluster), 1);
        } else break;
    }
    return suggestions;
}

// ─── Groq fallback recommendation ────────────────────────────────────────────
async function groqFallback(preferences, totalDays) {
    try {
        const { Destination } = require('../models');
        const allDests = await Destination.findAll({ limit: 50 });
        const availableStr = allDests.map(d => `- ${d.name} (${d.district}, ${d.category})`).join('\n');

        const prompt = `Recommend ${getClusterCount(totalDays) * 3} travel destinations in Sri Lanka for a ${totalDays}-day trip.
Preferences: ${preferences}.
Choose ONLY from these available destinations:
${availableStr}

Return ONLY a JSON: { "places": [{ "name": "...", "district": "...", "category": "..." }] }`;

        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5
            })
        });

        if (!resp.ok) throw new Error(`Groq API ${resp.status}`);
        const groqData = await resp.json();
        const text = groqData.choices?.[0]?.message?.content || '';
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON in Groq response');
        const parsed = JSON.parse(match[0]);

        // Format as a single "cluster"
        const places = (parsed.places || []).map((p, i) => {
            const dbMatch = allDests.find(d =>
                d.name.toLowerCase().includes(p.name.toLowerCase()) ||
                p.name.toLowerCase().includes(d.name.toLowerCase())
            );
            return {
                place_id:    dbMatch?.id || `fallback_${i}`,
                place:       p.name,
                city:        p.district || '',
                province:    '',
                category:    p.category || '',
                lat:         dbMatch?.lat || 7.8731,
                lon:         dbMatch?.lng || 80.7718,
                terrain:     'Mixed',
                time_needed: 2,
                rating:      4.0,
                cluster_id:  'GROQ',
                cluster:     'AI Recommended',
            };
        });

        return {
            success: true,
            fallback: true,
            data: {
                main: [{
                    cluster: 'AI Recommended',
                    score: 9.0,
                    lat: 7.8731,
                    lon: 80.7718,
                    places
                }],
                suggestions: [],
                limit: 1
            }
        };
    } catch (err) {
        console.error('[mlRecommend] Groq fallback error:', err.message);
        throw err;
    }
}

// ─── Main handler ─────────────────────────────────────────────────────────────
const mlRecommend = async (req, res) => {
    try {
        const {
            Likes_Beach = 0,
            Likes_Mountain = 0,
            Likes_Culture = 0,
            Likes_Adventure = 0,
            Budget = 2,
            Total_Days = 3,
            preferences = ''
        } = req.body;

        if (Total_Days < 1) {
            return res.status(400).json({ message: 'Total_Days must be at least 1' });
        }

        // ── 1. Call Python ML service ──────────────────────────────────────
        let rankedClusters;
        let usedFallback = false;

        try {
            const mlResp = await fetch('http://127.0.0.1:5001/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Likes_Beach, Likes_Mountain, Likes_Culture, Likes_Adventure, Budget, Total_Days }),
                signal: AbortSignal.timeout(8000)
            });

            if (!mlResp.ok) throw new Error(`ML service returned ${mlResp.status}`);
            const mlData = await mlResp.json();
            if (!mlData.clusters) throw new Error('Invalid ML response');
            rankedClusters = mlData.clusters;
        } catch (mlErr) {
            console.warn('[mlRecommend] Python ML offline, using Groq fallback:', mlErr.message);
            usedFallback = true;
            return res.json(await groqFallback(preferences || 'General', Total_Days));
        }

        // ── 2. Load CSV datasets ──────────────────────────────────────────
        const [locationRows, placeRows] = await Promise.all([
            loadCSV('cluster_latitude_longitude.csv'),
            loadCSV('data_with_clusterName.csv')
        ]);

        // Build location lookup map  { "Kandy Area": { lat, lon } }
        const locationMap = {};
        locationRows.forEach(r => {
            locationMap[r.Location] = { lat: parseFloat(r.Latitude), lon: parseFloat(r.Longitude) };
        });

        // ── 3. Select clusters by Haversine ───────────────────────────────
        const selectedClusters = selectBestClusters(rankedClusters, locationMap, Total_Days);
        const suggestions      = getSuggestions(rankedClusters, locationMap, selectedClusters);

        // ── 4. Attach places to each cluster ──────────────────────────────
        const attachPlaces = clusters => clusters.map(c => ({
            ...c,
            places: getTopPlaces(c.cluster, placeRows)
        }));

        res.json({
            success:  true,
            fallback: false,
            data: {
                main:        attachPlaces(selectedClusters),
                suggestions: attachPlaces(suggestions),
                limit:       getClusterCount(Total_Days)
            }
        });
    } catch (error) {
        console.error('[mlRecommend] Fatal error:', error);
        res.status(500).json({ message: 'ML recommendation failed', error: error.message });
    }
};

module.exports = { mlRecommend };
