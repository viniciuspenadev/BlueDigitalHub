<?php
// index.php

// 1. Language Configuration
$allowed_langs = ['pt', 'en', 'es'];
$lang = $_GET['lang'] ?? 'pt';
if (!in_array($lang, $allowed_langs)) {
    $lang = 'pt';
}

// Load translations
$t = require_once "lang/$lang.php";

// 2. SEO Meta Data (Dynamic based on lang)
$meta_title = "BlueDigital Hub | " . ($t['meta_title_suffix'] ?? 'Marketing & Tech');
$meta_desc = $t['meta_description'] ?? 'Soluções digitais inovadoras para o seu negócio.';

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>" class="scroll-smooth">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $meta_title; ?></title>
    <meta name="description" content="<?php echo $meta_desc; ?>">

    <!-- Open Graph / Social Media -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?php echo $meta_title; ?>">
    <meta property="og:description" content="<?php echo $meta_desc; ?>">
    <meta property="og:image" content="https://bluedigitalhub.com/og-image.jpg"> <!-- TODO: Add real image -->
    <meta property="og:url" content="https://bluedigitalhub.com">

    <!-- Tailwind CSS (CDN for now, can be compiled later) -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #0f172a;
            overflow-x: hidden;
        }

        .gradient-text {
            background: linear-gradient(to right, #0000bf, #0c46e6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(12, 70, 230, 0.1);
            box-shadow: 0 8px 32px 0 rgba(12, 70, 230, 0.05);
        }

        .floating-element {
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0% {
                transform: translateY(0px);
            }

            50% {
                transform: translateY(-20px);
            }

            100% {
                transform: translateY(0px);
            }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #f8fafc;
        }

        ::-webkit-scrollbar-thumb {
            background: #bfdbfe;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #0c46e6;
        }
    </style>
</head>

<body class="selection:bg-[#0c46e6] selection:text-white relative">

    <!-- Navbar -->
    <?php include 'includes/navbar.php'; ?>

    <!-- Main Content -->
    <main class="relative z-10">
        <?php include 'includes/hero.php'; ?>
        <?php include 'includes/services.php'; ?>
        <?php include 'includes/portfolio.php'; ?>
        <?php include 'includes/contact.php'; ?>
    </main>

    <!-- Floating Widget -->
    <?php // include 'includes/ai-consultant.php'; 
    ?>

    <!-- Footer -->
    <?php include 'includes/footer.php'; ?>

    <!-- Scripts -->
    <script src="assets/js/main.js"></script>
    <script>
        // src="assets/js/ia-chat.js"
    </script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();
    </script>
</body>

</html>