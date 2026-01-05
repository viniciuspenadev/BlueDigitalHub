<?php
// includes/contact.php
?>
<section id="contact" class="py-24 bg-slate-50 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <!-- Floating Decor -->
        <div class="absolute top-0 right-1/4 w-32 h-32 bg-[#0c46e6]/5 rounded-full blur-2xl"></div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">

            <div>
                <span class="text-[#0c46e6] font-bold tracking-wider uppercase text-sm mb-2 block">
                    <?php echo $t['contact_expert_label']; ?>
                </span>
                <h2 class="text-4xl font-bold text-[#0000bf] mb-6">
                    <?php echo $t['contact_title_hero']; ?>
                </h2>
                <p class="text-slate-600 mb-10 text-lg leading-relaxed">
                    <?php echo $t['contact_desc_hero']; ?>
                </p>

                <div class="space-y-8">
                    <div class="flex items-start group">
                        <div
                            class="bg-white p-4 rounded-2xl mr-5 shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                            <i data-lucide="mail" class="h-6 w-6 text-[#0c46e6]"></i>
                        </div>
                        <div>
                            <h4 class="text-slate-900 font-bold text-lg">
                                <?php echo $t['contact_email_label']; ?>
                            </h4>
                            <p class="text-slate-500">
                                <?php echo $t['contact_email_val']; ?>
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start group">
                        <div
                            class="bg-white p-4 rounded-2xl mr-5 shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                            <i data-lucide="phone" class="h-6 w-6 text-[#0c46e6]"></i>
                        </div>
                        <div>
                            <h4 class="text-slate-900 font-bold text-lg">
                                <?php echo $t['contact_phone_label']; ?>
                            </h4>
                            <p class="text-slate-500">
                                <?php echo $t['contact_phone_val']; ?>
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start group">
                        <div
                            class="bg-white p-4 rounded-2xl mr-5 shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                            <i data-lucide="map-pin" class="h-6 w-6 text-[#0c46e6]"></i>
                        </div>
                        <div>
                            <h4 class="text-slate-900 font-bold text-lg">
                                <?php echo $t['contact_address_label']; ?>
                            </h4>
                            <p class="text-slate-500">
                                <?php echo $t['contact_address_val']; ?>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-[#0000bf]/5 border border-slate-100 relative">
                <!-- Visual accent -->
                <div
                    class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-tr-[2rem]">
                </div>

                <form class="space-y-6 relative z-10"
                    onsubmit="event.preventDefault(); alert('Mensagem enviada! (Simulação)');">
                    <h3 class="text-2xl font-bold text-[#0000bf] mb-6">
                        <?php echo $t['contact_form_title']; ?>
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" class="block text-sm font-semibold text-slate-700 mb-2">
                                <?php echo $t['contact_field_name']; ?>
                            </label>
                            <input type="text" id="name"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#0c46e6] focus:border-transparent outline-none transition-all"
                                placeholder="<?php echo $t['contact_field_name_ph']; ?>" />
                        </div>
                        <div>
                            <label htmlFor="phone" class="block text-sm font-semibold text-slate-700 mb-2">
                                <?php echo $t['contact_field_phone']; ?>
                            </label>
                            <input type="text" id="phone"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#0c46e6] focus:border-transparent outline-none transition-all"
                                placeholder="<?php echo $t['contact_field_phone_ph']; ?>" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" class="block text-sm font-semibold text-slate-700 mb-2">
                            <?php echo $t['contact_field_email']; ?>
                        </label>
                        <input type="email" id="email"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#0c46e6] focus:border-transparent outline-none transition-all"
                            placeholder="<?php echo $t['contact_field_email_ph']; ?>" />
                    </div>

                    <div>
                        <label htmlFor="interest" class="block text-sm font-semibold text-slate-700 mb-2">
                            <?php echo $t['contact_field_interest']; ?>
                        </label>
                        <select id="interest"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#0c46e6] focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                            <option>
                                <?php echo $t['contact_opt_app']; ?>
                            </option>
                            <option>
                                <?php echo $t['contact_opt_web']; ?>
                            </option>
                            <option>
                                <?php echo $t['contact_opt_marketing']; ?>
                            </option>
                            <option>
                                <?php echo $t['contact_opt_consulting']; ?>
                            </option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" class="block text-sm font-semibold text-slate-700 mb-2">
                            <?php echo $t['contact_field_message']; ?>
                        </label>
                        <textarea id="message" rows="4"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#0c46e6] focus:border-transparent outline-none transition-all resize-none"
                            placeholder="<?php echo $t['contact_field_message_ph']; ?>"></textarea>
                    </div>

                    <button type="submit"
                        class="w-full bg-[#0c46e6] hover:bg-[#0000bf] text-white font-bold py-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-[#0c46e6]/20 flex items-center justify-center">
                        <?php echo $t['contact_button']; ?> <i data-lucide="send" class="ml-2 h-4 w-4"></i>
                    </button>
                </form>
            </div>

        </div>
    </div>
</section>