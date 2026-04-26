require("dotenv").config();

async function testGroqModel() {
    const prompt = "What are the top 3 places to visit in Sri Lanka? Return only a JSON array with the names.";

    console.log(`Testing model: openai/gpt-oss-120b...`);
    console.log(`Sending prompt: "${prompt}"\n`);

    try {
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
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content || "";

        console.log("=== API RESPONSE ===");
        console.log(content);
        console.log("====================");

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testGroqModel();
