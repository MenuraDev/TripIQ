from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)  # Allow requests from TripIQ Node backend

# ─── Load once at startup (VERY IMPORTANT for performance) ──────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model   = joblib.load(os.path.join(BASE_DIR, "model", "mlp.pkl"))
scaler  = joblib.load(os.path.join(BASE_DIR, "model", "scaler.pkl"))
clusters_df = pd.read_csv(os.path.join(BASE_DIR, "model-data", "cluster_with_distance copy.csv"))

cluster_names    = clusters_df['Cluster_Name']
cluster_features = clusters_df.drop(columns=['Cluster_Name'])

print("[OK] ML Model loaded successfully - TripIQ Python ML Service")

# ─── /predict endpoint ───────────────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Extract user preferences
        user = {
            'Likes_Beach':     int(data.get('Likes_Beach', 0)),
            'Likes_Mountain':  int(data.get('Likes_Mountain', 0)),
            'Likes_Culture':   int(data.get('Likes_Culture', 0)),
            'Likes_Adventure': int(data.get('Likes_Adventure', 0)),
            'Budget':          int(data.get('Budget', 2)),
            'Total_Days':      int(data.get('Total_Days', 3)),
        }

        rows = []
        # Build one input row per cluster
        for i in range(len(cluster_features)):
            row = user.copy()
            for col in cluster_features.columns:
                row[col] = cluster_features.iloc[i][col]
            rows.append(row)

        df = pd.DataFrame(rows)

        # Ensure column order matches training
        df = df[scaler.feature_names_in_]

        # Scale and predict
        scaled = scaler.transform(df)
        scores = model.predict(scaled)

        # Attach cluster names to scores
        results = [
            {"cluster": cluster_names.iloc[i], "score": float(scores[i])}
            for i in range(len(scores))
        ]

        # Sort by score descending
        results = sorted(results, key=lambda x: x['score'], reverse=True)

        return jsonify({"clusters": results})

    except Exception as e:
        print(f"[ERROR] /predict: {e}")
        return jsonify({"error": str(e)}), 500


# ─── Health check ─────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "TripIQ ML Service"}), 200


if __name__ == '__main__':
    print("[INFO] TripIQ Python ML Service starting on port 8000...")
    app.run(host='0.0.0.0', port=8000, debug=False)
