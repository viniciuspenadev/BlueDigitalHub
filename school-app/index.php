<?php
// school-app/index.php

// 1. Language Configuration
$allowed_langs = ['pt', 'en', 'es'];
$lang = $_GET['lang'] ?? 'pt';
if (!in_array($lang, $allowed_langs)) {
    $lang = 'pt';
}

// Load main translations
$t = require_once "../lang/$lang.php";

// Custom Overrides for this Landing Page (Startup Vibe)
$page_t = [
    'pt' => [
        'hero_badge' => '2.0 CHEGOU',
        'hero_title' => 'Gestão Escolar <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0c46e6] to-[#00d2ff]">Simplesmente Uau.</span>',
        'hero_subtitle' => 'Esqueça apps lentos e complexos. Experimente a nova era da conexão entre pais e escola. Rápido, lindo e inteligente.',
        'cta_primary' => 'Ver Demo Live',
        'cta_secondary' => 'Para Escolas',
        'stats_1' => '100% Mobile',
        'stats_1_desc' => 'Sem instalação',
        'stats_2' => 'Zero',
        'stats_2_desc' => 'Delay nas notas',
        'card_1_title' => 'Boletim',
        'card_1_val' => '10.0',
        'card_2_title' => 'Comunicado',
        'card_2_val' => 'Novo!',
    ],
    'en' => [
        'hero_badge' => '2.0 IS HERE',
        'hero_title' => 'School Mkmt <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0c46e6] to-[#00d2ff]">Simply Wow.</span>',
        'hero_subtitle' => 'Forget slow, complex apps. Experience the new era of parent-school connection. Fast, beautiful, and smart.',
        'cta_primary' => 'Live Demo',
        'cta_secondary' => 'For Schools',
        'stats_1' => '100% Mobile',
        'stats_1_desc' => 'No install',
        'stats_2' => 'Zero',
        'stats_2_desc' => 'Delay on grades',
        'card_1_title' => 'Grade',
        'card_1_val' => 'A+',
        'card_2_title' => 'Notice',
        'card_2_val' => 'New!',
    ],
    'es' => [
        'hero_badge' => 'LLEGÓ EL 2.0',
        'hero_title' => 'Gestión Escolar <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0c46e6] to-[#00d2ff]">Simplemente Guau.</span>',
        'hero_subtitle' => 'Olvida las apps lentas. Experimenta la nueva era de conexión padres-escuela. Rápido, hermoso e inteligente.',
        'cta_primary' => 'Ver Demo',
        'cta_secondary' => 'Para Escuelas',
        'stats_1' => '100% Móvil',
        'stats_1_desc' => 'Sin instalación',
        'stats_2' => 'Cero',
        'stats_2_desc' => 'Retraso en notas',
        'card_1_title' => 'Boletín',
        'card_1_val' => '10.0',
        'card_2_title' => 'Aviso',
        'card_2_val' => '¡Nuevo!',
    ]
];

$pt = $page_t[$lang];

// SEO Meta Data
$meta_title = "EduSaaS 2.0 | BlueDigital Hub";
$meta_desc = $pt['hero_subtitle'];

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>" class="scroll-smooth">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $meta_title; ?></title>
    <meta name="description" content="<?php echo $meta_desc; ?>">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?php echo $meta_title; ?>">
    <meta property="og:description" content="<?php echo $meta_desc; ?>">
    <meta property="og:image"
        content="assets/img/surprised-young-man-green-shirt-holding-smartphone-transparent-background.png">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Google Fonts: Plus Jakarta Sans for that 'Tech Startup' look -->
    <!-- Google Fonts: Plus Jakarta Sans (Tech) & Lora (Serif for 'Educa') -->
    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
        rel="stylesheet">

    <!-- Custom CSS -->
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #ffffff;
            color: #0f172a;
            overflow-x: hidden;
        }

        /* Tech Grid Background */
        .tech-grid {
            background-size: 50px 50px;
            background-image:
                linear-gradient(to right, rgba(12, 70, 230, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(12, 70, 230, 0.03) 1px, transparent 1px);
            mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }

        .blob-gradient {
            background: linear-gradient(135deg, #0c46e6 0%, #00d2ff 100%);
            filter: blur(80px);
            opacity: 0.15;
            z-index: 0;
        }

        /* Glassmorphism Cards with a 'Tech' Edge */
        .tech-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow:
                0 4px 6px -1px rgba(0, 0, 0, 0.05),
                0 2px 4px -1px rgba(0, 0, 0, 0.03),
                0 0 0 1px rgba(12, 70, 230, 0.05);
            /* Subtle border ring */
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tech-card:hover {
            transform: translateY(-5px);
            box-shadow:
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04),
                0 0 0 1px rgba(12, 70, 230, 0.2);
        }

        /* Dynamic Floating */
        @keyframes float-y {

            0%,
            100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-15px);
            }
        }

        @keyframes pulse-ring {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(12, 70, 230, 0.2);
            }

            70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(12, 70, 230, 0);
            }

            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(12, 70, 230, 0);
            }
        }

        .animate-float {
            animation: float-y 6s ease-in-out infinite;
        }

        .animate-pulse-ring {
            animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Typography tweaks */
        .glass-os {
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }

        .kerning-tight {
            letter-spacing: -0.04em;
        }
    </style>
</head>

<body class="selection:bg-[#0c46e6] selection:text-white relative">

    <!-- Custom BluEduca Navbar -->
    <nav class="fixed z-50 w-full top-0 md:top-6 px-4">
        <div
            class="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 rounded-full px-6 py-3 flex items-center justify-between shadow-xl shadow-black/5 ring-1 ring-black/5">

            <!-- Logo: BluEduca -->
            <a href="#" class="flex items-center gap-2 group">
                <i data-lucide="graduation-cap"
                    class="w-8 h-8 text-[#0c46e6] fill-blue-50 group-hover:scale-110 transition-transform"></i>
                <span class="font-bold text-2xl text-[#0000bf] tracking-tight">Blu<span
                        class="text-blue-600 font-extrabold">Educa</span></span>
            </a>

            <!-- Desktop Links (Centered & Corrected) -->
            <div class="hidden md:flex items-center gap-2">
                <a href="#features"
                    class="px-5 py-2 text-sm font-bold text-slate-600 hover:text-[#0c46e6] hover:bg-blue-50/50 rounded-full transition-all">Recursos</a>
                <a href="#solutions"
                    class="px-5 py-2 text-sm font-bold text-slate-600 hover:text-[#0c46e6] hover:bg-blue-50/50 rounded-full transition-all">Soluções</a>
                <a href="#contact"
                    class="px-5 py-2 text-sm font-bold text-slate-600 hover:text-[#0c46e6] hover:bg-blue-50/50 rounded-full transition-all">Comece
                    Agora</a>
            </div>

            <!-- Empty div to balance flex spacing if needed, but justify-between handles it -->
            <div class="hidden md:block w-8"></div>

        </div>
    </nav>

    <!-- Main Content -->
    <main class="relative w-full overflow-hidden">

        <!-- Background Elements -->
        <div class="absolute inset-0 tech-grid z-0"></div>
        <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] blob-gradient rounded-full"></div>
        <div
            class="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-sky-200 blur-[100px] opacity-20 rounded-full z-0">
        </div>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 lg:pt-16 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                <!-- Left Content: The Pitch -->
                <div class="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">



                    <!-- Headline -->
                    <h1 class="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[0.95] kerning-tight mb-8">
                        <?php echo $pt['hero_title']; ?>
                    </h1>

                    <!-- Subtitle -->
                    <p class="text-lg text-slate-600 mb-10 max-w-md leading-relaxed font-medium">
                        <?php echo $pt['hero_subtitle']; ?>
                    </p>

                    <!-- Stats & Branding (Replaces CTAs) -->
                    <div class="flex items-center gap-8 lg:gap-12 w-full justify-center lg:justify-start pt-4">

                        <!-- Stat: 100% Mobile -->
                        <div class="flex items-center gap-4">
                            <div
                                class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0c46e6] shadow-sm">
                                <i data-lucide="smartphone" class="w-6 h-6"></i>
                            </div>
                            <div class="text-left">
                                <div class="text-2xl font-bold text-slate-900 leading-none mb-1">
                                    <?php echo $pt['stats_1']; ?>
                                </div>
                                <div class="text-sm text-slate-500 font-medium"><?php echo $pt['stats_1_desc']; ?></div>
                            </div>
                        </div>

                        <!-- Divider -->
                        <div class="h-10 w-px bg-slate-200"></div>

                        <!-- Developed By -->
                        <div class="flex flex-col items-start">
                            <span
                                class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Desenvolvido
                                por</span>
                            <div class="flex items-center group opacity-90 hover:opacity-100 transition-opacity">
                                <i data-lucide="zap" class="h-5 w-5 text-[#0c46e6] mr-2 fill-current"></i>
                                <span class="font-bold text-lg text-[#0000bf] tracking-tight">BlueDigital<span
                                        class="font-light text-[#0c46e6]">Hub</span></span>
                            </div>
                        </div>
                    </div>


                </div>

                <!-- Right Content: The Visual (Surprised Man + Tech UI) -->
                <div
                    class="lg:col-span-7 relative h-full flex items-end justify-center lg:justify-end mt-16 lg:mt-0 lg:translate-y-24">

                    <!-- Immersive Background Glows (No more white wash) -->
                    <div
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0c46e6]/20 to-cyan-400/20 rounded-full blur-[80px] animate-pulse-ring z-0">
                    </div>

                    <!-- The Surprised Man Image (Full Height Integration) -->
                    <div class="relative z-10 w-full max-w-lg lg:max-w-xl mx-auto flex items-end h-full">
                        <img src="assets/img/surprised-young-man-green-shirt-holding-smartphone-transparent-background.png"
                            alt="Surprised User"
                            class="w-full h-auto object-contain object-bottom drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] relative z-10 transform scale-110 origin-bottom">

                        <!-- Dynamic Notification Feed Container -->
                        <!-- Positioned to be 'floating' in the air, roughly between phone level and shoulder/head level -->
                        <div id="notification-feed"
                            class="absolute top-[15%] right-0 scale-75 origin-right lg:scale-100 lg:top-[20%] lg:right-[-15%] w-72 flex flex-col gap-4 z-20 pointer-events-none h-64 justify-end overflow-hidden pb-4">
                            <!-- Cards will be injected here by JS -->
                        </div>

                        <!-- Floating Tech Card 1: Main Grade (Boletim) - Keep this as a static anchor for "Success" -->
                        <div
                            class="absolute top-[35%] left-4 scale-[0.6] origin-left lg:top-[12%] lg:left-[-20%] lg:scale-100 z-30 min-w-[220px]">
                            <div class="glass-os p-4 rounded-[2rem] flex items-center gap-4 animate-float">
                                <div
                                    class="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                                    <i data-lucide="award" class="w-7 h-7"></i>
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        <?php echo $pt['card_1_title']; ?> (Mat)
                                    </p>
                                    <div class="flex items-baseline gap-1">
                                        <p class="text-4xl font-black text-slate-800 leading-none tracking-tighter">
                                            <?php echo $pt['card_1_val']; ?>
                                        </p>
                                        <i data-lucide="check-circle-2"
                                            class="w-5 h-5 text-green-500 fill-green-100"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Floating Tech Card 3: Financial/Success (Bottom Left) -->
                        <div
                            class="absolute bottom-[40%] left-4 scale-75 origin-left lg:left-[-5%] lg:bottom-[50%] lg:scale-100 z-30 transform -rotate-1">
                            <div class="glass-os px-5 py-3 rounded-full animate-float shadow-2xl flex items-center gap-3"
                                style="animation-delay: 3.5s;">
                                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span class="text-sm font-bold text-slate-700">Mensalidade: Paga ✅</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <!-- "Bento Grid" Features Section -->
        <section id="features" class="bg-slate-50 py-32 relative z-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div class="text-center mb-24">
                    <h2 class="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Um Sistema. <span
                            class="text-[#0c46e6]">Infinitas Possibilidades.</span></h2>
                    <p class="text-lg text-slate-500 max-w-2xl mx-auto">Tudo o que uma escola moderna precisa, embalado
                        em uma experiência que os pais amam.</p>
                </div>

                <div
                    class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 lg:gap-8 auto-rows-[minmax(180px,auto)]">

                    <!-- Feature 1: Communication (Big Card) -->
                    <div
                        class="col-span-1 md:col-span-6 lg:col-span-7 bg-white rounded-[2.5rem] p-10 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div class="relative z-10">
                            <div
                                class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0c46e6] mb-6 group-hover:scale-110 transition-transform duration-300">
                                <i data-lucide="message-square-heart" class="w-7 h-7"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-slate-900 mb-3">Comunicação que Aproxima</h3>
                            <p class="text-slate-500 leading-relaxed max-w-md">Chat direto, seguro e organizado. Chega
                                de grupos de WhatsApp bagunçados. A escola no controle da narrativa.</p>
                        </div>
                        <!-- UI decoration -->
                        <div
                            class="absolute right-[-20px] bottom-[-20px] w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700">
                        </div>

                        <!-- Dynamic Communication Feed -->
                        <div id="comm-feed" class="absolute inset-0 flex flex-col justify-end pointer-events-none pb-0">
                            <!-- JS Injected -->
                        </div>
                    </div>

                    <!-- Feature 2: Financial (Tall Card) -->
                    <div
                        class="col-span-1 md:col-span-6 lg:col-span-5 bg-[#0c46e6] text-white rounded-[2.5rem] p-10 shadow-[0_20px_40px_-12px_rgba(12,70,230,0.4)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                        <div class="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div
                                    class="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20">
                                    <i data-lucide="wallet" class="w-7 h-7"></i>
                                </div>
                                <h3 class="text-2xl font-bold mb-3">Inadimplência Zero</h3>
                                <p class="text-blue-100 leading-relaxed">Boletos automáticos e lembretes gentis que
                                    funcionam.</p>
                            </div>

                            <!-- Mini Graph Mockup -->
                            <div class="mt-8 flex items-end gap-2 h-24 opacity-80">
                                <div class="w-8 bg-white/20 rounded-t-lg h-[40%]"></div>
                                <div class="w-8 bg-white/20 rounded-t-lg h-[60%]"></div>
                                <div class="w-8 bg-white/20 rounded-t-lg h-[30%]"></div>
                                <div class="w-8 bg-white rounded-t-lg h-[85%] shadow-lg relative">
                                    <div
                                        class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#0c46e6] text-[10px] font-bold px-2 py-1 rounded-full">
                                        +40%</div>
                                </div>
                                <div class="w-8 bg-white/20 rounded-t-lg h-[55%]"></div>
                            </div>
                        </div>
                        <!-- Noise overlay -->
                        <div
                            class="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                        </div>
                    </div>

                    <!-- Feature 3: Academic (Square) -->
                    <div
                        class="col-span-1 md:col-span-3 lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] border border-slate-100 hover:border-blue-200 transition-colors duration-300">
                        <div
                            class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                            <i data-lucide="graduation-cap" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Pedagógico</h3>
                        <p class="text-sm text-slate-500">Diário de classe digital, notas e frequências em tempo real.
                        </p>
                    </div>

                    <!-- Feature 4: Security (Square) -->
                    <div
                        class="col-span-1 md:col-span-3 lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] border border-slate-100 hover:border-blue-200 transition-colors duration-300">
                        <div
                            class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                            <i data-lucide="shield-check" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">Segurança Pura</h3>
                        <p class="text-sm text-slate-500">Controle de portaria com QR Code e autorizações digitais.</p>
                    </div>

                    <!-- Feature 5: Timeline (Wide) -->
                    <div
                        class="col-span-1 md:col-span-6 lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white relative overflow-hidden group">
                        <div class="relative z-10 h-full flex flex-col">
                            <h3 class="text-lg font-bold mb-1 text-slate-200 uppercase tracking-widest text-[10px]">
                                Timeline</h3>
                            <p class="text-2xl font-bold mb-6">O Dia a Dia, Gravado.</p>

                            <!-- Dynamic Timeline Feed (Fixed Height to prevent jitter) -->
                            <div id="timeline-feed"
                                class="flex flex-col gap-4 relative h-[160px] overflow-hidden mask-linear-fade">
                                <!-- JS Injected -->
                            </div>
                        </div>
                        <div
                            class="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-tl from-[#00d2ff]/20 to-transparent rounded-tl-[100px]">
                        </div>
                    </div>

                </div>

            </div>
        </section>

        <!-- Deep Dive Section (Zig-Zag) -->
        <section id="solutions" class="py-32 bg-white relative z-20 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <!-- Section Header -->
                <div class="text-center mb-24">
                    <h2 class="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">O Poder <span
                            class="text-[#0c46e6]">Real</span> da Tecnologia.</h2>
                    <p class="text-lg text-slate-500 max-w-2xl mx-auto">Não é apenas sobre digitizar. É sobre
                        transformar a experiência escolar em algo mágico.</p>
                </div>

                <!-- Pillar 1: Communication (Zig) -->
                <div class="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <!-- Text -->
                    <div class="order-2 lg:order-1">
                        <div
                            class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0c46e6] mb-6">
                            <i data-lucide="message-circle" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-slate-900 mb-4">Comunicação que Aproxima</h3>
                        <p class="text-slate-600 text-lg leading-relaxed mb-6">
                            Esqueça os bilhetes perdidos na mochila. Crie um canal direto e seguro com as famílias.
                            Envie comunicados, fotos e autorizações com um clique.
                        </p>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Confirmação de leitura em tempo real</li>
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Segmentação por turmas ou alunos</li>
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Chat privado monitorado</li>
                        </ul>
                    </div>
                    <!-- Interactive Visual -->
                    <div class="order-1 lg:order-2 relative group">
                        <!-- Background Blob -->
                        <div
                            class="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] transform rotate-3 scale-105 opacity-60">
                        </div>
                        <div class="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl">
                            <!-- Message Bubble 1 -->
                            <div class="flex items-end justify-end mb-4">
                                <div
                                    class="bg-[#0c46e6] text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-md max-w-[80%]">
                                    <p class="text-sm font-medium">Lembrete: Reunião pedagógica amanhã às 19h! 📅</p>
                                </div>
                                <div class="w-2 h-2 rounded-full bg-blue-200 ml-2 mb-2"></div>
                            </div>
                            <!-- Message Bubble 2 (Simula Resposta Mãe) -->
                            <div class="flex items-end justify-start mb-6">
                                <div
                                    class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mr-3 text-xs font-bold border border-pink-200">
                                    M</div>
                                <div
                                    class="bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] relative">
                                    <p class="text-sm font-medium">Combinado! Estaremos presentes.</p>
                                    <!-- Typing Indicator (Absolute floating) -->
                                    <div
                                        class="absolute -bottom-8 left-0 bg-white border border-slate-100 px-3 py-2 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                                        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                                            style="animation-delay: 0.1s"></div>
                                        <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                                            style="animation-delay: 0.2s"></div>
                                    </div>
                                </div>
                            </div>
                            <!-- Floating Status -->
                            <div
                                class="absolute top-4 right-6 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pillar 2: Financial (Zag) -->
                <div class="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <!-- Interactive Visual (Left on Desktop) -->
                    <div class="order-1 relative group">
                        <div
                            class="absolute inset-0 bg-gradient-to-bl from-green-50 to-emerald-50 rounded-[3rem] transform -rotate-2 scale-105 opacity-60">
                        </div>
                        <div
                            class="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl flex flex-col items-center text-center overflow-hidden">
                            <!-- Bill Icon -->
                            <div
                                class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform duration-500">
                                <i data-lucide="file-text" class="w-8 h-8"></i>
                            </div>
                            <h4 class="text-xl font-bold text-slate-800 mb-1">Mensalidade - Março</h4>
                            <p class="text-lg font-bold text-slate-900 mb-6">R$ 1.250,00</p>

                            <!-- Pay Button Simulation -->
                            <div
                                class="w-full bg-[#0c46e6] text-white py-3 rounded-xl font-bold mb-4 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all cursor-pointer relative overflow-hidden">
                                <span class="relative z-10">Pagar com Pix</span>
                                <div
                                    class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                </div>
                            </div>
                            <p class="text-xs text-slate-400">Processamento seguro e imediato.</p>

                            <!-- Stamp Animation Overlay -->
                            <div
                                class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <div
                                    class="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-xl border-2 border-green-500 text-green-600 font-black text-2xl uppercase tracking-widest transform scale-150 rotate-[-12deg] group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                                    PAGO ✅
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Text -->
                    <div class="order-2">
                        <div
                            class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                            <i data-lucide="wallet" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-slate-900 mb-4">Financeiro Descomplicado</h3>
                        <p class="text-slate-600 text-lg leading-relaxed mb-6">
                            Reduza a inadimplência com automação inteligente. Gere boletos, receba via Pix e concilie
                            pagamentos automaticamente. Tudo integrado.
                        </p>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Baixa automática de pagamentos</li>
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Lembretes de vencimento automáticos</li>
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Relatórios financeiros detalhados</li>
                        </ul>
                    </div>
                </div>

                <!-- Pillar 3: Pedagogical (Zig) -->
                <div class="grid lg:grid-cols-2 gap-16 items-center">
                    <!-- Text -->
                    <div class="order-2 lg:order-1">
                        <div
                            class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                            <i data-lucide="graduation-cap" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-slate-900 mb-4">Pedagógico Eficiente</h3>
                        <p class="text-slate-600 text-lg leading-relaxed mb-6">
                            Potencialize o aprendizado. Lance notas, controle frequências e gerencie conteúdos
                            curriculares sem burocracia. O foco volta a ser o aluno.
                        </p>
                        <ul class="space-y-3 mb-8">
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Diário de classe digital mobile</li>
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Boletins personalizáveis</li>
                            <li class="flex items-center gap-3 text-slate-600 font-medium"><i data-lucide="check"
                                    class="w-5 h-5 text-green-500"></i> Acompanhamento de desempenho visual</li>
                        </ul>
                    </div>
                    <!-- Interactive Visual -->
                    <div class="order-1 lg:order-2 relative group">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem] transform rotate-2 scale-105 opacity-60">
                        </div>
                        <div
                            class="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl flex flex-col gap-4">
                            <!-- Subject Header -->
                            <div class="flex justify-between items-center border-b border-slate-50 pb-4">
                                <div>
                                    <h4 class="font-bold text-slate-800">Matemática</h4>
                                    <p class="text-xs text-slate-400">3º Bimestre</p>
                                </div>
                                <div class="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold">
                                    Aprovado</div>
                            </div>
                            <!-- Grade Slider Simulation -->
                            <div>
                                <div class="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                    <span>Nota Final</span>
                                    <span class="text-purple-600 text-lg">9.5</span>
                                </div>
                                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[0%] group-hover:w-[95%] transition-all duration-[1.5s] ease-out rounded-full">
                                    </div>
                                </div>
                            </div>
                            <!-- Attendance Grid -->
                            <div class="pt-2">
                                <p class="text-xs font-bold text-slate-500 mb-2">Frequência</p>
                                <div class="flex gap-1">
                                    <div
                                        class="h-8 flex-1 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                        <i data-lucide="check" class="w-4 h-4"></i>
                                    </div>
                                    <div
                                        class="h-8 flex-1 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                        <i data-lucide="check" class="w-4 h-4"></i>
                                    </div>
                                    <div
                                        class="h-8 flex-1 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                        <i data-lucide="check" class="w-4 h-4"></i>
                                    </div>
                                    <div
                                        class="h-8 flex-1 bg-green-100 rounded-lg flex items-center justify-center text-green-600 opacity-50 group-hover:opacity-100 transition-opacity delay-300">
                                        <i data-lucide="check" class="w-4 h-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CTA Section -->
                <div class="mt-24 text-center">
                    <a href="#contact"
                        class="inline-flex items-center gap-3 bg-[#0c46e6] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg shadow-blue-500/30 group">
                        Agendar Demonstração
                        <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <p class="mt-4 text-sm text-slate-500 font-medium">Sem compromisso. Teste grátis por 7 dias.</p>
                </div>

            </div>

    </main>

    <!-- Typeform-Style Lead Capture Quiz -->
    <section id="contact" class="py-32 bg-slate-50 relative overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div class="absolute top-[10%] left-[10%] w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-40"></div>
            <div class="absolute bottom-[10%] right-[10%] w-64 h-64 bg-purple-100 rounded-full blur-[80px] opacity-40">
            </div>
        </div>

        <div class="max-w-xl mx-auto px-6 relative z-10">

            <!-- Progress Bar -->
            <div class="w-full bg-slate-200 h-1.5 rounded-full mb-12 overflow-hidden">
                <div id="quiz-progress" class="h-full bg-[#0c46e6] w-[10%] transition-all duration-500 ease-out"></div>
            </div>

            <!-- Quiz Container -->
            <div
                class="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 relative min-h-[420px] flex items-center justify-center text-center">

                <!-- Step 1: Intro / Challenge -->
                <div id="step-1"
                    class="w-full transition-all duration-500 transform transla translate-x-0 opacity-100 absolute inset-0 p-12 flex flex-col justify-center">
                    <span class="text-[#0c46e6] font-bold tracking-wider uppercase text-xs mb-4">Passo 1 de 3</span>
                    <h3 class="text-3xl font-extrabold text-slate-900 mb-8 leading-tight">Qual o maior desafio da sua
                        gestão hoje?</h3>
                    <div class="flex flex-col gap-4">
                        <button onclick="nextStep(2, 'Inadimplência')"
                            class="w-full py-4 px-6 rounded-xl border-2 border-slate-100 hover:border-[#0c46e6] hover:bg-blue-50 text-slate-600 hover:text-[#0c46e6] font-bold text-lg transition-all text-left flex items-center justify-between group">
                            <span>Inadimplência Alta</span>
                            <i data-lucide="arrow-right"
                                class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </button>
                        <button onclick="nextStep(2, 'Comunicação')"
                            class="w-full py-4 px-6 rounded-xl border-2 border-slate-100 hover:border-[#0c46e6] hover:bg-blue-50 text-slate-600 hover:text-[#0c46e6] font-bold text-lg transition-all text-left flex items-center justify-between group">
                            <span>Comunicação com Pais</span>
                            <i data-lucide="arrow-right"
                                class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </button>
                        <button onclick="nextStep(2, 'Burocracia')"
                            class="w-full py-4 px-6 rounded-xl border-2 border-slate-100 hover:border-[#0c46e6] hover:bg-blue-50 text-slate-600 hover:text-[#0c46e6] font-bold text-lg transition-all text-left flex items-center justify-between group">
                            <span>Burocracia Pedagógica</span>
                            <i data-lucide="arrow-right"
                                class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </button>
                    </div>
                </div>

                <!-- Step 2: Size -->
                <div id="step-2"
                    class="w-full transition-all duration-500 transform translate-x-full opacity-0 pointer-events-none absolute inset-0 p-12 flex flex-col justify-center">
                    <button onclick="prevStep(1)"
                        class="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors"><i
                            data-lucide="arrow-left" class="w-6 h-6"></i></button>

                    <span class="text-[#0c46e6] font-bold tracking-wider uppercase text-xs mb-4">Passo 2 de 3</span>
                    <h3 class="text-3xl font-extrabold text-slate-900 mb-8 leading-tight">Quantos alunos a escola
                        possui?</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <button onclick="nextStep(3, '0-100')"
                            class="py-6 px-4 rounded-xl border-2 border-slate-100 hover:border-[#0c46e6] hover:bg-blue-50 text-slate-600 hover:text-[#0c46e6] font-bold text-xl transition-all">
                            0 - 100
                        </button>
                        <button onclick="nextStep(3, '100-300')"
                            class="py-6 px-4 rounded-xl border-2 border-slate-100 hover:border-[#0c46e6] hover:bg-blue-50 text-slate-600 hover:text-[#0c46e6] font-bold text-xl transition-all">
                            100 - 300
                        </button>
                        <button onclick="nextStep(3, '300-500')"
                            class="py-6 px-4 rounded-xl border-2 border-slate-100 hover:border-[#0c46e6] hover:bg-blue-50 text-slate-600 hover:text-[#0c46e6] font-bold text-xl transition-all">
                            300 - 500
                        </button>
                        <button onclick="nextStep(3, '500+')"
                            class="py-6 px-4 rounded-xl border-2 border-slate-100 hover:border-[#0c46e6] hover:bg-blue-50 text-slate-600 hover:text-[#0c46e6] font-bold text-xl transition-all">
                            500+
                        </button>
                    </div>
                </div>

                <!-- Step 3: Contact Form -->
                <div id="step-3"
                    class="w-full transition-all duration-500 transform translate-x-full opacity-0 pointer-events-none absolute inset-0 p-12 flex flex-col justify-center">
                    <button onclick="prevStep(2)"
                        class="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors"><i
                            data-lucide="arrow-left" class="w-6 h-6"></i></button>

                    <span class="text-[#0c46e6] font-bold tracking-wider uppercase text-xs mb-4">Passo Final</span>
                    <h3 class="text-3xl font-extrabold text-slate-900 mb-6 leading-tight">Vamos revolucionar sua escola.
                    </h3>
                    <p class="text-slate-500 mb-8">Deixe seu contato para agendarmos uma demo exclusiva.</p>

                    <form onsubmit="submitQuiz(event)" class="flex flex-col gap-4 text-left">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-2 ml-1">Seu Nome</label>
                            <input type="text" required
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0c46e6] focus:ring-1 focus:ring-[#0c46e6] transition-all"
                                placeholder="Ex: Ana Silva">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 uppercase mb-2 ml-1">WhatsApp /
                                Celular</label>
                            <input type="tel" required
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0c46e6] focus:ring-1 focus:ring-[#0c46e6] transition-all"
                                placeholder="(11) 99999-9999">
                        </div>
                        <button type="submit"
                            class="w-full bg-[#0c46e6] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-[1.02] transition-all mt-4 flex items-center justify-center gap-2">
                            Agendar Minha Demo <i data-lucide="check" class="w-5 h-5"></i>
                        </button>
                    </form>
                </div>

                <!-- Step 4: Success -->
                <div id="step-success"
                    class="w-full transition-all duration-500 transform translate-x-full opacity-0 pointer-events-none absolute inset-0 p-12 flex flex-col justify-center items-center text-center">
                    <div
                        class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce">
                        <i data-lucide="check-circle-2" class="w-10 h-10"></i>
                    </div>
                    <h3 class="text-3xl font-extrabold text-slate-900 mb-4">Recebemos! 🚀</h3>
                    <p class="text-slate-600 text-lg mb-8">Nossa equipe entrará em contato em breve para apresentar o
                        futuro da sua gestão escolar.</p>
                    <button onclick="resetQuiz()" class="text-[#0c46e6] font-bold text-sm hover:underline">Voltar ao
                        início</button>
                </div>

            </div>

            <p class="text-center text-slate-400 text-sm mt-8 flex items-center justify-center gap-2">
                <i data-lucide="lock" class="w-4 h-4"></i> Seus dados estão seguros conosco.
            </p>

        </div>
    </section>

    <!-- Footer -->
    <?php include '../includes/footer.php'; ?>

    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();

        // Dynamic Notification Logic
        const feedContainer = document.getElementById('notification-feed');
        const notifications = [
            {
                icon: 'message-circle',
                iconColor: 'text-blue-500',
                bg: 'bg-blue-100',
                title: 'Coordenação',
                time: 'Agora',
                desc: 'Reunião de pais confirmada para sexta.',
                type: 'chat'
            },
            {
                icon: 'check-circle',
                iconColor: 'text-green-500',
                bg: 'bg-green-100',
                title: 'Financeiro',
                time: '2min',
                desc: 'Mensalidade de Março Confirmada!',
                type: 'success'
            },
            {
                icon: 'calendar',
                iconColor: 'text-purple-500',
                bg: 'bg-purple-100',
                title: 'Novo Evento',
                time: '15min',
                desc: 'Feira de Ciências: 25/08',
                type: 'event'
            },
            {
                icon: 'book-open',
                iconColor: 'text-amber-500',
                bg: 'bg-amber-100',
                title: 'Tarefa de Casa',
                time: '30min',
                desc: 'Matemática: Pág 45 a 50.',
                type: 'task'
            }
        ];

        let index = 0;

        function createCard(data) {
            const el = document.createElement('div');
            el.className = 'glass-os p-4 rounded-2xl flex items-start gap-3 transform translate-y-10 opacity-0 transition-all duration-700 ease-out shadow-lg mb-2';
            el.innerHTML = `
                <div class="w-10 h-10 rounded-full ${data.bg} flex items-center justify-center ${data.iconColor} shrink-0">
                    <i data-lucide="${data.icon}" class="w-5 h-5"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center w-full mb-0.5">
                        <span class="text-xs font-bold text-slate-900">${data.title}</span>
                        <span class="text-[10px] text-slate-400">${data.time}</span>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-snug truncate">${data.desc}</p>
                </div>
            `;
            return el;
        }

        function spawnNotification() {
            const data = notifications[index];
            const card = createCard(data);

            // Allow Lucide to process the new icon
            feedContainer.appendChild(card);
            lucide.createIcons();

            // Animate In (Next Frame)
            requestAnimationFrame(() => {
                card.classList.remove('translate-y-10', 'opacity-0');
            });

            // Animate Out
            setTimeout(() => {
                card.classList.add('-translate-y-10', 'opacity-0', 'scale-95'); // Move up and fade out
                setTimeout(() => {
                    if (card.parentNode) feedContainer.removeChild(card);
                }, 700); // Wait for transition to finish
            }, 4000); // Stay visible for 4s

            index = (index + 1) % notifications.length;
        }

        // Start Loop
        setTimeout(() => {
            spawnNotification();
            setInterval(spawnNotification, 2500); // New card every 2.5s
        }, 1000);

        // --- Bento Grid Animations ---

        // 1. Communication Feed Logic (Enhanced Glass)
        const commFeed = document.getElementById('comm-feed');
        const commMessages = [
            { name: 'Mãe do Pedro', msg: 'Adorei as fotos de hoje! 😍', time: 'Agora', img: 'https://ui-avatars.com/api/?name=M&background=f0f9ff&color=0c46e6' },
            { name: 'Secretaria', msg: 'Documento pendente enviado.', time: '5min', img: 'https://ui-avatars.com/api/?name=S&background=fefce8&color=d97706' },
            { name: 'Prof. Ana', msg: 'Joãozinho participou super bem!', time: '12min', img: 'https://ui-avatars.com/api/?name=A&background=f0fdf4&color=16a34a' },
            { name: 'Pai da Julia', msg: 'Chegando para buscar.', time: '15min', img: 'https://ui-avatars.com/api/?name=P&background=fdf4ff&color=9333ea' }
        ];
        let commIndex = 0;

        function spawnCommCard() {
            const data = commMessages[commIndex];
            const el = document.createElement('div');

            // Fixed: Right Aligned, Fixed Width (w-72), reduced Shadow (shadow-lg)
            el.className = 'absolute bottom-6 right-6 w-80 p-5 rounded-3xl shadow-lg transform translate-y-12 opacity-0 transition-all duration-700 border border-white/60 bg-white/40 backdrop-blur-xl z-20';

            el.innerHTML = `
                <div class="flex items-start gap-4">
                    <img src="${data.img}" class="w-10 h-10 rounded-full shadow-sm border border-white/50" alt="${data.name}">
                    <div class="flex-1">
                        <div class="flex justify-between items-baseline mb-1">
                            <div class="text-sm font-bold text-slate-800">${data.name}</div>
                            <div class="text-[10px] text-slate-500 font-medium">${data.time}</div>
                        </div>
                        <p class="text-xs text-slate-700 leading-relaxed font-medium">"${data.msg}"</p>
                    </div>
                </div>
             `;

            commFeed.appendChild(el);

            // Animate In
            requestAnimationFrame(() => {
                el.classList.remove('translate-y-12', 'opacity-0');
            });

            // Animate Out
            setTimeout(() => {
                el.classList.add('-translate-y-12', 'opacity-0', 'scale-95'); // Move UP and fade
                setTimeout(() => { if (el.parentNode) commFeed.removeChild(el); }, 700);
            }, 3200);

            commIndex = (commIndex + 1) % commMessages.length;
        }

        // 2. Timeline Feed Logic (Fluid Transitions)
        const timelineFeed = document.getElementById('timeline-feed');
        // Initial State
        const timelineData = [
            { time: '07:30', title: 'Entrada', active: false },
            { time: '08:00', title: 'Café da manhã', active: true },
            { time: '09:00', title: 'Roda de Leitura', active: false },
            { time: '10:00', title: 'Parquinho', active: false },
            { time: '11:30', title: 'Almoço', active: false }
        ];

        let timelineActiveIndex = 1;

        function initTimeline() {
            timelineFeed.innerHTML = '';
            timelineData.slice(0, 3).forEach((item, i) => { // Show 3 items initially
                const row = createTimelineRow(item);
                row.id = `tl-row-${i}`;
                timelineFeed.appendChild(row);
            });
        }

        function createTimelineRow(item) {
            const row = document.createElement('div');
            // Clean Look: No BG, No Border, No Shadow. Just position/scale.
            row.className = `flex items-center gap-2 p-3 rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${item.active ? 'translate-x-4 scale-105' : 'opacity-40'}`;

            const dotClass = item.active
                ? 'w-3 h-3 rounded-full bg-[#00d2ff] shadow-[0_0_15px_#00d2ff] scale-100'
                : 'w-2 h-2 rounded-full bg-slate-600';

            const textClass = item.active
                ? 'text-sm font-bold text-white tracking-wide'
                : 'text-xs text-slate-400 font-medium';

            row.innerHTML = `
                <div class="${dotClass} transition-all duration-700"></div>
                <div class="${textClass} transition-all duration-700">${item.time} • ${item.title}</div>
            `;
            return row;
        }

        function rotateTimeline() {
            // Logic: 
            // 1. Remove top item (fade out & slide up)
            // 2. Shift active state (middle becomes top, bottom becomes middle/active)
            // 3. Add new item at bottom (fade in & slide up)

            const first = timelineFeed.firstElementChild;
            if (!first) return;

            // Animate Exit First
            first.style.marginTop = '-80px';
            first.style.opacity = '0';

            setTimeout(() => {
                if (first.parentNode) timelineFeed.removeChild(first);

                // Add new item at end
                const nextItemIndex = (timelineActiveIndex + 2) % timelineData.length;
                const nextData = timelineData[nextItemIndex];

                // Prepare new row (Inactive)
                const newRow = createTimelineRow({ ...nextData, active: false });
                newRow.style.opacity = '0';
                newRow.style.transform = 'translateY(20px)';
                timelineFeed.appendChild(newRow);

                // Animate Entrance
                requestAnimationFrame(() => {
                    newRow.style.opacity = '0.4'; // Start inactive opacity
                    newRow.style.transform = 'translateY(0)';
                });

                // Update Active State Visuals
                const rows = timelineFeed.children; // Should be 3 rows now
                if (rows.length >= 2) {
                    // Make middle one active
                    const activeRow = rows[1];
                    updateRowVisuals(activeRow, true);

                    // Make top one inactive
                    const topRow = rows[0];
                    updateRowVisuals(topRow, false);
                }

                timelineActiveIndex = (timelineActiveIndex + 1) % timelineData.length;

            }, 700);
        }

        function updateRowVisuals(row, isActive) {
            // Updated to remove BG/Border/Shadow from active state
            row.className = `flex items-center gap-2 p-3 rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? 'translate-x-4 scale-105' : 'opacity-40'}`;

            const dot = row.children[0];
            const text = row.children[1];

            if (isActive) {
                dot.className = 'w-3 h-3 rounded-full bg-[#00d2ff] shadow-[0_0_15px_#00d2ff] scale-100 transition-all duration-700';
                text.className = 'text-sm font-bold text-white tracking-wide transition-all duration-700';
            } else {
                dot.className = 'w-2 h-2 rounded-full bg-slate-600 transition-all duration-700';
                text.className = 'text-xs text-slate-400 font-medium transition-all duration-700';
            }
        }

        // Start Bento Animations
        setTimeout(() => {
            spawnCommCard();
            setInterval(spawnCommCard, 3500); // 3.5s

            initTimeline();
            setInterval(rotateTimeline, 3000); // 3s
        }, 1500);


        // --- Lead Capture Quiz Logic ---
        const quizData = {};

        function nextStep(targetStep, value) {
            if (value) quizData[`q${targetStep - 1}`] = value;

            const currentId = `step-${targetStep - 1}`;
            const nextId = `step-${targetStep}`;
            const currentEl = document.getElementById(currentId);
            const nextEl = document.getElementById(nextId);

            // Animate Out Current (Slide Left)
            currentEl.classList.add('-translate-x-full', 'opacity-0', 'pointer-events-none');
            currentEl.classList.remove('translate-x-0', 'opacity-100');

            // Animate In Next (Slide from Right)
            nextEl.classList.remove('translate-x-full', 'opacity-0', 'pointer-events-none');
            nextEl.classList.add('translate-x-0', 'opacity-100');

            // Update Progress
            const progress = document.getElementById('quiz-progress');
            if (targetStep === 2) progress.style.width = '50%';
            if (targetStep === 3) progress.style.width = '85%';
        }

        function prevStep(targetStep) {
            const currentId = `step-${targetStep + 1}`;
            const prevId = `step-${targetStep}`;
            const currentEl = document.getElementById(currentId);
            const prevEl = document.getElementById(prevId);

            // Animate Out Current (Slide Right)
            currentEl.classList.add('translate-x-full', 'opacity-0', 'pointer-events-none');
            currentEl.classList.remove('translate-x-0', 'opacity-100');

            // Animate In Prev (Slide from Left)
            prevEl.classList.remove('-translate-x-full', 'opacity-0', 'pointer-events-none');
            prevEl.classList.add('translate-x-0', 'opacity-100');

            // Update Progress
            const progress = document.getElementById('quiz-progress');
            if (targetStep === 1) progress.style.width = '10%';
            if (targetStep === 2) progress.style.width = '50%';
        }

        function submitQuiz(e) {
            e.preventDefault();

            // Simulate API Call
            const btn = e.target.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Enviando...';
            lucide.createIcons();

            setTimeout(() => {
                // Success State
                const currentEl = document.getElementById('step-3');
                const nextEl = document.getElementById('step-success');
                const progress = document.getElementById('quiz-progress');

                currentEl.classList.add('-translate-x-full', 'opacity-0', 'pointer-events-none');
                nextEl.classList.remove('translate-x-full', 'opacity-0', 'pointer-events-none');

                progress.style.width = '100%';
                progress.classList.replace('bg-[#0c46e6]', 'bg-green-500');

            }, 1500);
        }

        function resetQuiz() {
            location.reload(); // Simplest reset for now
        }

    </script>
</body>

</html>