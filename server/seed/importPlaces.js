// server/seed/importPlaces.js
// Run once: node server/seed/importPlaces.js
// Imports places from Flask's CSV dataset into MySQL destinations table

require('dotenv').config({ path: require('path').join(__dirname, '../../../python-ml/../server/../.env') });
// Try loading .env from server directory
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const fs   = require('fs');
const path = require('path');
const csv  = require('csv-parser');
const { sequelize } = require('../config/db');
const Destination   = require('../models/Destination');

const CSV_PATH = path.join(__dirname, '../../python-ml/data/data_with_clusterName.csv');

async function importPlaces() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connected');
        await Destination.sync({ alter: true });
        console.log('✅ Destination model synced');

        const rows = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(CSV_PATH)
                .pipe(csv())
                .on('data', d => rows.push(d))
                .on('end', resolve)
                .on('error', reject);
        });

        console.log(`📦 ${rows.length} places found in CSV`);

        let inserted = 0, skipped = 0;

        for (const row of rows) {
            const name     = (row.Place_Name || '').trim();
            const district = (row.City       || row.Province || '').trim();

            if (!name || !district) { skipped++; continue; }

            const exists = await Destination.findOne({ where: { name, district } });
            if (exists) { skipped++; continue; }

            await Destination.create({
                name,
                category:          row.Category      || 'General',
                district:          district,
                lat:               parseFloat(row.Latitude)  || null,
                lng:               parseFloat(row.Longitude) || null,
                description:       `${row.Category || ''} in ${row.City || ''}, ${row.Province || ''}. Terrain: ${row.Terrain_Type || 'N/A'}.`,
                image_url:         null,
                province:          row.Province       || null,
                cluster_name:      row.Cluster_Name   || null,
                cluster_id:        row.Cluster_ID     || null,
                rating:            parseFloat(row.Rating) || null,
                terrain_type:      row.Terrain_Type   || null,
                time_needed_hours: parseFloat(row['Time_Needed (H)']) || null,
            });
            inserted++;
        }

        console.log(`✅ Import complete — ${inserted} inserted, ${skipped} skipped`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Import failed:', err.message);
        process.exit(1);
    }
}

importPlaces();
