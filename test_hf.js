require('dotenv').config();
const axios = require('axios');

async function test() {
    try {
        const response = await axios.post(
            'https://router.huggingface.co/v1/chat/completions',
            {
                model: 'Qwen/Qwen2.5-72B-Instruct',
                messages: [{ role: 'user', content: 'Respond with the word SUCCESS' }],
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("SUCCESS! Response:", response.data.choices[0].message.content);
    } catch (err) {
        console.error("FAIL!", err.response ? err.response.data : err.message);
    }
}
test();
