<?php
// api/chat.php

// 1. Headers
header('Content-Type: text/plain'); // Streaming text
header('Cache-Control: no-cache');
header('Connection: keep-alive');

// 2. Configuration
// TODO: Replace with your actual API Key or use getenv('GEMINI_API_KEY')
// API Key from Environment Variable (Best for Docker/Easypanel)
$apiKey = getenv('GEMINI_API_KEY') ?: 'YOUR_GEMINI_API_KEY_HERE';
$model = 'gemini-1.5-flash';
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/$model:streamGenerateContent?key=$apiKey";

// 3. Get Input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['history'])) {
    http_response_code(400);
    echo "Bad Request: No history provided.";
    exit;
}

// 4. Prepare Payload
$contents = $input['history'];

// System Instruction
$systemInstruction = [
    "parts" => [
        [
            "text" => "
Você é a **Bia**, Consultora de IA da **BlueDigital Hub**.
Sua meta: Engajar o visitante e conseguir o contato (Lead) para o time comercial, mas de forma natural e sofisticada.

**Sobre a BlueDigital Hub:**
- Somos uma agência premium de Marketing e Tecnologia.
- Cores: Azul profundo e vibrante. Estilo: Moderno e 'Soft'.
- Foco: Apps, WebApps e Estratégias de Crescimento.

**Regras de Ouro:**
1. **Seja Breve:** Use respostas curtas, como num chat de WhatsApp. Evite textões.
2. **Uma pergunta por vez:** Não inunde o cliente.
3. **Personalidade:** Profissional, tecnológica, mas empática.
4. **Foco:** Entenda a dor do cliente -> Sugira uma solução macro -> Peça o contato para detalhar valores.

**Roteiro Sugerido:**
- Comece entendendo o objetivo (Vender mais? Criar um App? Otimizar processos?).
- Mostre autoridade ('Na BlueDigital, já resolvemos isso usando...').
- Para dar preço ou escopo, diga: 'Para eu pedir pro nosso especialista teimar um orçamento personalizado, qual seu WhatsApp ou Email?'
        "
        ]
    ]
];

$data = [
    "contents" => $contents,
    "systemInstruction" => $systemInstruction,
    // "tools" => ... (Implemented in phase 2)
    "generationConfig" => [
        "temperature" => 0.7,
        "maxOutputTokens" => 500,
    ]
];

// 5. Execute cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false); // Important for manual streaming
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, $data) {
    // Parse Gemini Stream Chunk
    // The API returns a JSON array structure in chunks, usually like "data: {...}\n\n" or just raw JSON pieces
    // Caution: Creating a robust JSON stream parser in PHP is complex.
    // For this MVP, we will extract the "text" field using regex from the raw chunk if possible,
    // OR simpy flush the raw chunk to frontend and let JS parse. 
    // BUT, Gemini raw stream is a list of JSON objects.

    // Simplest approach: Try to decode the chunk as partial JSON or extract text.
    // The chunk might contain multiple JSON objects or partial ones.

    // Regex to find "text": "..."
    if (preg_match_all('/"text":\s*"([^"]*)"/', $data, $matches)) {
        foreach ($matches[1] as $text) {
            // Unescape JSON string
            $cleanText = json_decode('"' . $text . '"');
            echo $cleanText;
            flush();
        }
    }

    return strlen($data);
});

$result = curl_exec($ch);

if (curl_errno($ch)) {
    echo "\n\nError: " . curl_error($ch);
}

curl_close($ch);
?>