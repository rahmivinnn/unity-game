// Educational Content for Electrical Experiments

class EducationalContent {
    constructor() {
        this.tips = this.initializeTips();
        this.formulas = this.initializeFormulas();
        this.safetyRules = this.initializeSafetyRules();
        this.realWorldApplications = this.initializeApplications();
        this.interactiveQuizzes = this.initializeQuizzes();
    }

    initializeTips() {
        return [
            {
                category: "Sumber Listrik",
                tips: [
                    "💡 Baterai mengubah energi kimia menjadi energi listrik melalui reaksi redoks",
                    "🔋 Baterai alkaline bertahan lebih lama daripada baterai karbon-zinc",
                    "⚡ Panel surya menghasilkan listrik dari energi matahari menggunakan efek fotovoltaik",
                    "🌊 Generator mengubah energi mekanik menjadi energi listrik",
                    "🔌 Adaptor mengubah AC menjadi DC dengan tegangan yang sesuai"
                ]
            },
            {
                category: "Peralatan Rumah Tangga",
                tips: [
                    "💡 Lampu LED menggunakan 80% lebih sedikit energi daripada lampu pijar",
                    "❄️ Kulkas bekerja dengan prinsip kompresi dan ekspansi refrigeran",
                    "🌀 Kipas angin menggerakkan udara untuk memberikan efek pendinginan",
                    "📺 TV modern menggunakan teknologi LCD atau OLED yang hemat energi",
                    "🔥 Setrika menggunakan elemen pemanas untuk menghasilkan panas"
                ]
            },
            {
                category: "Energi Terbarukan",
                tips: [
                    "☀️ Panel surya dapat menghasilkan listrik bahkan saat cuaca mendung",
                    "💨 Turbin angin mengubah energi kinetik angin menjadi listrik",
                    "💧 Pembangkit listrik tenaga air memanfaatkan aliran air",
                    "🌍 Energi terbarukan membantu mengurangi emisi karbon",
                    "🔋 Baterai lithium-ion dapat menyimpan energi terbarukan"
                ]
            },
            {
                category: "Penyimpanan Energi",
                tips: [
                    "🔋 Kapasitor menyimpan energi dalam medan listrik",
                    "⚡ Baterai lithium memiliki kepadatan energi tinggi",
                    "🔄 Baterai dapat diisi ulang ribuan kali",
                    "📱 Power bank menggunakan baterai lithium-ion",
                    "🏠 Sistem penyimpanan rumah dapat mengurangi tagihan listrik"
                ]
            },
            {
                category: "Smart Grid",
                tips: [
                    "🌐 Smart meter memungkinkan monitoring konsumsi real-time",
                    "🏠 Smart home dapat mengoptimalkan penggunaan energi",
                    "📊 IoT sensor membantu efisiensi energi",
                    "🔌 Smart plug dapat dikontrol dari jarak jauh",
                    "⚡ Grid pintar dapat mengintegrasikan energi terbarukan"
                ]
            }
        ];
    }

    initializeFormulas() {
        return [
            {
                name: "Hukum Ohm",
                formula: "V = I × R",
                description: "Tegangan sama dengan arus dikali resistansi",
                variables: {
                    "V": "Tegangan (Volt)",
                    "I": "Arus (Ampere)", 
                    "R": "Resistansi (Ohm)"
                },
                example: "Jika arus 2A mengalir melalui resistor 5Ω, maka tegangan = 2 × 5 = 10V"
            },
            {
                name: "Daya Listrik",
                formula: "P = V × I",
                description: "Daya sama dengan tegangan dikali arus",
                variables: {
                    "P": "Daya (Watt)",
                    "V": "Tegangan (Volt)",
                    "I": "Arus (Ampere)"
                },
                example: "Lampu 12V dengan arus 0.5A memiliki daya = 12 × 0.5 = 6W"
            },
            {
                name: "Energi Listrik",
                formula: "E = P × t",
                description: "Energi sama dengan daya dikali waktu",
                variables: {
                    "E": "Energi (Watt-hour)",
                    "P": "Daya (Watt)",
                    "t": "Waktu (jam)"
                },
                example: "Lampu 60W menyala 5 jam menggunakan energi = 60 × 5 = 300Wh"
            },
            {
                name: "Resistansi Kawat",
                formula: "R = ρ × L / A",
                description: "Resistansi bergantung pada material, panjang, dan luas penampang",
                variables: {
                    "R": "Resistansi (Ohm)",
                    "ρ": "Resistivitas material (Ω⋅m)",
                    "L": "Panjang kawat (m)",
                    "A": "Luas penampang (m²)"
                },
                example: "Kawat tembaga lebih panjang memiliki resistansi lebih besar"
            },
            {
                name: "Kapasitansi",
                formula: "C = Q / V",
                description: "Kapasitansi adalah kemampuan menyimpan muatan",
                variables: {
                    "C": "Kapasitansi (Farad)",
                    "Q": "Muatan (Coulomb)",
                    "V": "Tegangan (Volt)"
                },
                example: "Kapasitor 1000μF pada 12V menyimpan muatan = 1000×10⁻⁶ × 12 = 0.012C"
            }
        ];
    }

    initializeSafetyRules() {
        return [
            {
                level: "Dasar",
                rules: [
                    "⚠️ Jangan menyentuh kabel listrik dengan tangan basah",
                    "🔌 Selalu cabut steker dari stop kontak, bukan dari kabelnya",
                    "💡 Matikan saklar sebelum mengganti lampu",
                    "🚫 Jangan memasukkan benda logam ke stop kontak",
                    "👶 Jauhkan anak-anak dari peralatan listrik"
                ]
            },
            {
                level: "Menengah",
                rules: [
                    "⚡ Gunakan ELCB/RCBO untuk perlindungan tambahan",
                    "🔧 Periksa kondisi kabel secara berkala",
                    "🏠 Pasang grounding yang baik di rumah",
                    "📏 Jangan melebihi kapasitas maksimum stop kontak",
                    "🔥 Jauhkan kabel dari sumber panas"
                ]
            },
            {
                level: "Lanjutan",
                rules: [
                    "⚡ Gunakan multimeter untuk mengukur tegangan",
                    "🔒 Lakukan lockout/tagout saat maintenance",
                    "📋 Ikuti standar keselamatan listrik nasional",
                    "👷 Gunakan APD yang sesuai saat bekerja",
                    "📞 Hubungi teknisi berlisensi untuk pekerjaan kompleks"
                ]
            }
        ];
    }

    initializeApplications() {
        return [
            {
                object: "Baterai",
                applications: [
                    "📱 Smartphone dan tablet",
                    "🚗 Kendaraan listrik",
                    "💡 Lampu emergency",
                    "⌚ Jam tangan digital",
                    "🎮 Remote control dan gamepad"
                ]
            },
            {
                object: "Panel Surya",
                applications: [
                    "🏠 Sistem listrik rumah",
                    "🛰️ Satelit dan stasiun luar angkasa",
                    "💡 Lampu jalan tenaga surya",
                    "💧 Pompa air tenaga surya",
                    "📱 Charger portable"
                ]
            },
            {
                object: "Motor Listrik",
                applications: [
                    "🌀 Kipas angin dan AC",
                    "🚗 Kendaraan listrik",
                    "🏭 Mesin industri",
                    "🚁 Drone dan quadcopter",
                    "🏠 Peralatan rumah tangga"
                ]
            },
            {
                object: "Transformator",
                applications: [
                    "⚡ Distribusi listrik PLN",
                    "🔌 Adaptor elektronik",
                    "🏭 Industri berat",
                    "🚇 Kereta listrik",
                    "📺 TV dan monitor"
                ]
            },
            {
                object: "LED",
                applications: [
                    "💡 Lampu rumah dan kantor",
                    "📱 Layar smartphone",
                    "🚦 Lampu lalu lintas",
                    "📺 TV dan billboard",
                    "🚗 Lampu kendaraan"
                ]
            }
        ];
    }

    initializeQuizzes() {
        return [
            {
                category: "Sumber Listrik",
                questions: [
                    {
                        question: "Apa yang terjadi di dalam baterai saat menghasilkan listrik?",
                        options: [
                            "Reaksi kimia mengubah energi kimia menjadi listrik",
                            "Magnet berputar menghasilkan listrik",
                            "Panas diubah menjadi listrik",
                            "Cahaya diubah menjadi listrik"
                        ],
                        correct: 0,
                        explanation: "Baterai menggunakan reaksi kimia redoks untuk mengubah energi kimia menjadi energi listrik."
                    },
                    {
                        question: "Mengapa panel surya dapat menghasilkan listrik?",
                        options: [
                            "Karena panas matahari",
                            "Karena efek fotovoltaik",
                            "Karena angin",
                            "Karena magnet"
                        ],
                        correct: 1,
                        explanation: "Panel surya menggunakan efek fotovoltaik dimana foton cahaya membebaskan elektron dalam material semikonduktor."
                    }
                ]
            },
            {
                category: "Keselamatan",
                questions: [
                    {
                        question: "Apa yang harus dilakukan sebelum mengganti lampu?",
                        options: [
                            "Mematikan saklar",
                            "Memakai sarung tangan",
                            "Membuka jendela",
                            "Menyiapkan lampu baru"
                        ],
                        correct: 0,
                        explanation: "Selalu matikan saklar terlebih dahulu untuk memutus aliran listrik sebelum mengganti lampu."
                    }
                ]
            }
        ];
    }

    getTipsByCategory(category) {
        const categoryTips = this.tips.find(t => t.category === category);
        return categoryTips ? categoryTips.tips : [];
    }

    getRandomTip() {
        const allTips = this.tips.flatMap(category => category.tips);
        return allTips[Math.floor(Math.random() * allTips.length)];
    }

    getFormula(name) {
        return this.formulas.find(f => f.name === name);
    }

    getSafetyRules(level = "Dasar") {
        const safetyLevel = this.safetyRules.find(s => s.level === level);
        return safetyLevel ? safetyLevel.rules : [];
    }

    getApplications(objectName) {
        const app = this.realWorldApplications.find(a => a.object === objectName);
        return app ? app.applications : [];
    }

    getQuizByCategory(category) {
        const quiz = this.interactiveQuizzes.find(q => q.category === category);
        return quiz ? quiz.questions : [];
    }

    calculateElectricalValues(voltage, current, resistance) {
        const results = {};
        
        // Hukum Ohm: V = I × R
        if (voltage && current) {
            results.resistance = voltage / current;
        } else if (voltage && resistance) {
            results.current = voltage / resistance;
        } else if (current && resistance) {
            results.voltage = current * resistance;
        }
        
        // Daya: P = V × I
        if (voltage && current) {
            results.power = voltage * current;
        }
        
        return results;
    }

    formatElectricalUnit(value, unit) {
        const units = {
            'V': { base: 'V', kilo: 'kV', mega: 'MV' },
            'A': { base: 'A', milli: 'mA', micro: 'μA' },
            'Ω': { base: 'Ω', kilo: 'kΩ', mega: 'MΩ' },
            'W': { base: 'W', kilo: 'kW', mega: 'MW' },
            'F': { base: 'F', milli: 'mF', micro: 'μF', nano: 'nF', pico: 'pF' }
        };

        if (!units[unit]) return `${value}${unit}`;

        const unitSet = units[unit];
        
        if (value >= 1000000 && unitSet.mega) {
            return `${(value / 1000000).toFixed(2)}${unitSet.mega}`;
        } else if (value >= 1000 && unitSet.kilo) {
            return `${(value / 1000).toFixed(2)}${unitSet.kilo}`;
        } else if (value < 1 && value >= 0.001 && unitSet.milli) {
            return `${(value * 1000).toFixed(2)}${unitSet.milli}`;
        } else if (value < 0.001 && value >= 0.000001 && unitSet.micro) {
            return `${(value * 1000000).toFixed(2)}${unitSet.micro}`;
        } else if (value < 0.000001 && value >= 0.000000001 && unitSet.nano) {
            return `${(value * 1000000000).toFixed(2)}${unitSet.nano}`;
        } else if (value < 0.000000001 && unitSet.pico) {
            return `${(value * 1000000000000).toFixed(2)}${unitSet.pico}`;
        }
        
        return `${value}${unitSet.base}`;
    }

    generateElectricalFact() {
        const facts = [
            "⚡ Listrik bergerak dengan kecepatan mendekati kecepatan cahaya",
            "🔋 Baterai pertama ditemukan oleh Alessandro Volta pada tahun 1800",
            "💡 Lampu LED dapat bertahan hingga 25.000 jam",
            "⚡ Petir dapat mencapai suhu 30.000°C, 5 kali lebih panas dari permukaan matahari",
            "🏠 Rumah rata-rata menggunakan 10.000 kWh listrik per tahun",
            "🌍 Sekitar 1 miliar orang di dunia masih belum memiliki akses listrik",
            "💨 Turbin angin terbesar dapat menghasilkan 15 MW listrik",
            "☀️ Matahari mengirim energi ke Bumi setara dengan 10.000 kali konsumsi energi dunia",
            "🔌 Stop kontak pertama ditemukan pada tahun 1904",
            "⚡ Tubuh manusia menghasilkan listrik sekitar 100 watt saat istirahat"
        ];
        
        return facts[Math.floor(Math.random() * facts.length)];
    }

    getEnergyEfficiencyTips() {
        return [
            "💡 Ganti lampu pijar dengan LED untuk menghemat 80% energi",
            "❄️ Atur AC pada suhu 24-26°C untuk efisiensi optimal",
            "🔌 Cabut charger dari stop kontak saat tidak digunakan",
            "🌞 Manfaatkan cahaya alami di siang hari",
            "🏠 Gunakan peralatan berlabel Energy Star",
            "⏰ Gunakan timer untuk peralatan listrik",
            "🚿 Gunakan water heater tenaga surya",
            "📱 Aktifkan mode hemat daya pada perangkat elektronik",
            "🌡️ Isolasi rumah dengan baik untuk mengurangi beban AC",
            "🔄 Lakukan maintenance rutin pada peralatan listrik"
        ];
    }
}

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EducationalContent;
} else {
    window.EducationalContent = EducationalContent;
}