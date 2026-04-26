const { Destination } = require('../models');

// Helper to find image for a place
const getPlaceImage = (placeName, category) => {
    const term = `${placeName} ${category} Sri Lanka`.replace(/\s+/g, ',');
    return `https://images.unsplash.com/photo-1588127333419-b9d7de223dcf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`; // Default placeholder or logic below
};

// @desc    Step 2: Recommend travel places based on preferences
// @route   POST /api/ai/recommend-places
// @access  Tourist
const recommendPlaces = async (req, res) => {
    try {
        const { preferences, duration, budget, groupSize } = req.body;

        // Fetch all admin-added destinations from the DB first so AI can choose from them
        const allDests = await Destination.findAll();
        const availablePlacesStr = allDests.length > 0
            ? allDests.map(d => `- ${d.name} (${d.district}, ${d.category})`).join('\n            ')
            : "No places available in the system yet. Please return an empty list or generic places.";

        const prompt = `
            Act as a Sri Lanka travel expert.
            Recommend exactly 5 travel destinations based on:
            - Preferences: ${preferences}
            - Trip Duration: ${duration}
            - Total Budget: ${budget} LKR
            - Group Size: ${groupSize}

            IMPORTANT: You MUST ONLY select places from the following list of available destinations:
            ${availablePlacesStr}

            Return the response strictly as a JSON object with this structure:
            {
                "places": [
                    {
                        "name": "Exact Name from Available List",
                        "district": "Exact District from Available List",
                        "category": "Exact Category from Available List",
                        "estimated_cost": 5000 
                    }
                ]
            }
            Return ONLY the JSON.
        `;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Groq API Error: ${response.status} - ${errorData}`);
        }

        const result = await response.json();
        const text = result.choices?.[0]?.message?.content || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) throw new Error('AI failed to return valid JSON');

        const data = JSON.parse(jsonMatch[0]);

        // Post-process to add images and Db IDs by matching the names
        const enhancedPlaces = data.places.map(p => {
            const dbMatch = allDests.find(d => 
                d.name.toLowerCase().trim() === p.name.toLowerCase().trim() || 
                d.name.toLowerCase().includes(p.name.toLowerCase()) || 
                p.name.toLowerCase().includes(d.name.toLowerCase())
            );

            return {
                ...p,
                id: dbMatch ? dbMatch.id : null,
                image_url: dbMatch && dbMatch.image_url ? `http://localhost:5000${dbMatch.image_url}` : `https://images.unsplash.com/photo-1552423158-7681720f4f9a?w=800&auto=format&fit=crop`
            };
        });

        res.json({ places: enhancedPlaces });
    } catch (error) {
        console.error('Recommend Error:', error);
        if (error.status === 429) {
            const retryAfter = error?.errorDetails?.[2]?.retryDelay || 10;
            console.log(`Rate limit exceeded. Retry after ${retryAfter}s`);
            return res.status(429).json({
                message: `AI Rate Limit Exceeded. Please retry after ${retryAfter}s.`,
                error: 'Quota reached on Free Tier'
            });
        }
        res.status(500).json({ message: 'Error recommending places', error: error.message });
    }
};

// @desc    Step 3: Generate AI Itinerary based on selected places
// @route   POST /api/ai/generate-itinerary
// @access  Tourist
const generateItinerary = async (req, res) => {
    try {
        const { selectedPlaces, duration, startDate } = req.body;

        if (!selectedPlaces || selectedPlaces.length === 0) {
            return res.status(400).json({ message: 'No places selected' });
        }

        const placeNames = selectedPlaces.map(p => p.name).join(', ');

        const prompt = `
            Create a ${duration}-day travel itinerary in Sri Lanka starting on ${startDate} using these places:
            ${placeNames}

            Include:
            - Day number
            - Places to visit
            - Travel time (e.g. "3 hours from Colombo")
            - Activities
            - Estimated daily cost (LKR)

            Return strictly as a JSON object:
            {
                "itinerary": [
                    {
                        "day": 1,
                        "date": "YYYY-MM-DD",
                        "places": ["Place A"],
                        "travel_time": "Text description",
                        "activities": "Text description",
                        "estimated_daily_cost": 8000
                    }
                ],
                "summary": "Short trip summary"
            }
            Return ONLY the JSON.
        `;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Groq API Error: ${response.status} - ${errorData}`);
        }

        const groqResult = await response.json();
        const text = groqResult.choices?.[0]?.message?.content || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) throw new Error('AI failed to return valid JSON');

        const itineraryData = JSON.parse(jsonMatch[0]);
        res.json(itineraryData);

    } catch (error) {
        console.error('Itinerary Error:', error);
        if (error.status === 429) {
            const retryAfter = error?.errorDetails?.[2]?.retryDelay || 10;
            console.log(`Rate limit exceeded. Retry after ${retryAfter}s`);
            return res.status(429).json({
                message: `AI Rate Limit Exceeded. Please retry after ${retryAfter}s.`,
                error: 'Quota reached on Free Tier'
            });
        }
        res.status(500).json({ message: 'Error generating itinerary', error: error.message });
    }
};

module.exports = {
    recommendPlaces,
    generateItinerary
};
