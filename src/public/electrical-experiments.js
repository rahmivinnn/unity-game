// 50 Electrical Experiments Data Structure
// Interactive Educational Content for Electrical Learning

class ElectricalExperiments {
    constructor() {
        this.currentExperiment = 0;
        this.completedExperiments = new Set();
        this.score = 0;
        this.experiments = this.initializeExperiments();
    }

    initializeExperiments() {
        return [
            // Basic Electrical Components (1-10)
            {
                id: 1,
                title: "Baterai AA",
                category: "Sumber Listrik",
                description: "Baterai kering yang menghasilkan tegangan 1.5V",
                leftObject: { name: "Terminal Positif (+)", type: "source", voltage: 1.5 },
                rightObject: { name: "Terminal Negatif (-)", type: "ground", voltage: 0 },
                connector: { name: "Kabel Tembaga", resistance: 0.1 },
                task: "Hubungkan terminal positif ke negatif untuk membuat rangkaian sederhana",
                explanation: "Baterai mengubah energi kimia menjadi energi listrik",
                difficulty: "mudah"
            },
            {
                id: 2,
                title: "Lampu LED",
                category: "Beban Listrik",
                description: "Light Emitting Diode yang hemat energi",
                leftObject: { name: "Anoda (+)", type: "input", voltage: 3.3 },
                rightObject: { name: "Katoda (-)", type: "output", voltage: 0 },
                connector: { name: "Resistor 220Ω", resistance: 220 },
                task: "Pasang resistor untuk melindungi LED dari arus berlebih",
                explanation: "LED memerlukan resistor untuk membatasi arus agar tidak rusak",
                difficulty: "mudah"
            },
            {
                id: 3,
                title: "Saklar SPST",
                category: "Kontrol",
                description: "Single Pole Single Throw switch untuk on/off",
                leftObject: { name: "Input Terminal", type: "input", voltage: 12 },
                rightObject: { name: "Output Terminal", type: "output", voltage: 0 },
                connector: { name: "Kontak Saklar", resistance: 0 },
                task: "Tekan saklar untuk menghubungkan atau memutus rangkaian",
                explanation: "Saklar mengontrol aliran listrik dengan membuka/menutup kontak",
                difficulty: "mudah"
            },
            {
                id: 4,
                title: "Resistor 1kΩ",
                category: "Komponen Pasif",
                description: "Komponen yang menghambat aliran arus listrik",
                leftObject: { name: "Terminal A", type: "input", voltage: 5 },
                rightObject: { name: "Terminal B", type: "output", voltage: 0 },
                connector: { name: "Elemen Resistif", resistance: 1000 },
                task: "Ukur penurunan tegangan pada resistor",
                explanation: "Resistor mengubah energi listrik menjadi panas",
                difficulty: "mudah"
            },
            {
                id: 5,
                title: "Kapasitor 100μF",
                category: "Komponen Pasif",
                description: "Komponen yang menyimpan muatan listrik",
                leftObject: { name: "Pelat Positif", type: "input", voltage: 9 },
                rightObject: { name: "Pelat Negatif", type: "output", voltage: 0 },
                connector: { name: "Dielektrik", resistance: "infinite" },
                task: "Amati proses pengisian dan pengosongan kapasitor",
                explanation: "Kapasitor menyimpan energi dalam medan listrik",
                difficulty: "sedang"
            },
            {
                id: 6,
                title: "Dioda Silikon",
                category: "Semikonduktor",
                description: "Komponen yang hanya mengalirkan arus satu arah",
                leftObject: { name: "Anoda", type: "input", voltage: 5 },
                rightObject: { name: "Katoda", type: "output", voltage: 4.3 },
                connector: { name: "Junction P-N", resistance: 0.7 },
                task: "Balik polaritas untuk melihat sifat satu arah dioda",
                explanation: "Dioda memiliki tegangan maju 0.7V untuk silikon",
                difficulty: "sedang"
            },
            {
                id: 7,
                title: "Transistor NPN",
                category: "Semikonduktor",
                description: "Komponen penguat dan saklar elektronik",
                leftObject: { name: "Kolektor", type: "output", voltage: 12 },
                rightObject: { name: "Emitor", type: "ground", voltage: 0 },
                connector: { name: "Basis (Control)", resistance: "variable" },
                task: "Berikan sinyal basis untuk mengontrol arus kolektor-emitor",
                explanation: "Transistor dapat mengamplifikasi sinyal atau sebagai saklar",
                difficulty: "sulit"
            },
            {
                id: 8,
                title: "Induktor 10mH",
                category: "Komponen Pasif",
                description: "Komponen yang menyimpan energi dalam medan magnet",
                leftObject: { name: "Terminal 1", type: "input", voltage: "AC" },
                rightObject: { name: "Terminal 2", type: "output", voltage: "AC" },
                connector: { name: "Lilitan Kawat", resistance: 2 },
                task: "Amati bagaimana induktor menahan perubahan arus",
                explanation: "Induktor menghasilkan back-EMF saat arus berubah",
                difficulty: "sedang"
            },
            {
                id: 9,
                title: "Transformator",
                category: "Konversi Energi",
                description: "Mengubah level tegangan AC",
                leftObject: { name: "Primer (220V)", type: "input", voltage: 220 },
                rightObject: { name: "Sekunder (12V)", type: "output", voltage: 12 },
                connector: { name: "Inti Besi", resistance: 0.1 },
                task: "Amati perubahan tegangan dari primer ke sekunder",
                explanation: "Transformator bekerja berdasarkan induksi elektromagnetik",
                difficulty: "sedang"
            },
            {
                id: 10,
                title: "Fuse 5A",
                category: "Proteksi",
                description: "Pengaman yang putus saat arus berlebih",
                leftObject: { name: "Input", type: "input", voltage: 12 },
                rightObject: { name: "Output", type: "output", voltage: 12 },
                connector: { name: "Kawat Fuse", resistance: 0.01 },
                task: "Simulasikan arus berlebih untuk melihat fuse putus",
                explanation: "Fuse melindungi rangkaian dari arus berlebih",
                difficulty: "mudah"
            },

            // Household Appliances (11-20)
            {
                id: 11,
                title: "Lampu Pijar 60W",
                category: "Penerangan",
                description: "Lampu konvensional dengan filamen tungsten",
                leftObject: { name: "Terminal Hidup", type: "input", voltage: 220 },
                rightObject: { name: "Terminal Netral", type: "ground", voltage: 0 },
                connector: { name: "Filamen Tungsten", resistance: 806 },
                task: "Hitung konsumsi energi per jam",
                explanation: "Lampu pijar mengubah 95% energi menjadi panas",
                difficulty: "mudah"
            },
            {
                id: 12,
                title: "Kipas Angin 75W",
                category: "Pendingin",
                description: "Motor listrik untuk sirkulasi udara",
                leftObject: { name: "Fase", type: "input", voltage: 220 },
                rightObject: { name: "Netral", type: "ground", voltage: 0 },
                connector: { name: "Motor Induksi", resistance: 645 },
                task: "Bandingkan efisiensi dengan AC",
                explanation: "Kipas menggunakan motor induksi untuk memutar baling-baling",
                difficulty: "mudah"
            },
            {
                id: 13,
                title: "Kulkas 150W",
                category: "Pendingin",
                description: "Sistem refrigerasi dengan kompresor",
                leftObject: { name: "Line", type: "input", voltage: 220 },
                rightObject: { name: "Neutral", type: "ground", voltage: 0 },
                connector: { name: "Kompresor + Kontrol", resistance: 323 },
                task: "Amati siklus on/off kompresor",
                explanation: "Kulkas menggunakan siklus refrigerasi untuk mendinginkan",
                difficulty: "sedang"
            },
            {
                id: 14,
                title: "AC 1500W",
                category: "Pendingin",
                description: "Air Conditioner untuk pendingin ruangan",
                leftObject: { name: "L1 (Fase)", type: "input", voltage: 220 },
                rightObject: { name: "N (Netral)", type: "ground", voltage: 0 },
                connector: { name: "Kompresor + Fan", resistance: 32.3 },
                task: "Hitung biaya operasional per hari",
                explanation: "AC adalah peralatan paling boros energi di rumah",
                difficulty: "sedang"
            },
            {
                id: 15,
                title: "Rice Cooker 400W",
                category: "Memasak",
                description: "Penanak nasi dengan elemen pemanas",
                leftObject: { name: "Hot", type: "input", voltage: 220 },
                rightObject: { name: "Neutral", type: "ground", voltage: 0 },
                connector: { name: "Heating Element", resistance: 121 },
                task: "Simulasikan mode memasak dan menghangatkan",
                explanation: "Rice cooker menggunakan termostat untuk kontrol suhu",
                difficulty: "mudah"
            },
            {
                id: 16,
                title: "Microwave 800W",
                category: "Memasak",
                description: "Pemanas makanan dengan gelombang mikro",
                leftObject: { name: "Power Input", type: "input", voltage: 220 },
                rightObject: { name: "Ground", type: "ground", voltage: 0 },
                connector: { name: "Magnetron", resistance: 60.5 },
                task: "Amati konversi energi listrik ke gelombang mikro",
                explanation: "Microwave menggunakan magnetron untuk menghasilkan gelombang 2.45GHz",
                difficulty: "sulit"
            },
            {
                id: 17,
                title: "Setrika 1000W",
                category: "Perawatan",
                description: "Alat untuk merapikan pakaian",
                leftObject: { name: "Live Wire", type: "input", voltage: 220 },
                rightObject: { name: "Neutral Wire", type: "ground", voltage: 0 },
                connector: { name: "Heating Plate", resistance: 48.4 },
                task: "Atur suhu untuk berbagai jenis kain",
                explanation: "Setrika menggunakan elemen pemanas dengan kontrol termostat",
                difficulty: "mudah"
            },
            {
                id: 18,
                title: "TV LED 100W",
                category: "Hiburan",
                description: "Televisi dengan teknologi LED backlight",
                leftObject: { name: "AC Input", type: "input", voltage: 220 },
                rightObject: { name: "Ground", type: "ground", voltage: 0 },
                connector: { name: "Power Supply + Panel", resistance: 484 },
                task: "Bandingkan konsumsi dengan TV tabung",
                explanation: "TV LED lebih efisien dibanding TV tabung (CRT)",
                difficulty: "mudah"
            },
            {
                id: 19,
                title: "Komputer 300W",
                category: "Elektronik",
                description: "Personal computer dengan PSU",
                leftObject: { name: "AC 220V", type: "input", voltage: 220 },
                rightObject: { name: "Ground", type: "ground", voltage: 0 },
                connector: { name: "Power Supply Unit", resistance: 161 },
                task: "Amati konsumsi daya saat idle vs load",
                explanation: "PSU mengkonversi AC ke DC untuk komponen komputer",
                difficulty: "sedang"
            },
            {
                id: 20,
                title: "Charger HP 18W",
                category: "Elektronik",
                description: "Adaptor untuk mengisi baterai smartphone",
                leftObject: { name: "AC 220V", type: "input", voltage: 220 },
                rightObject: { name: "DC 5V", type: "output", voltage: 5 },
                connector: { name: "Switching Converter", resistance: "variable" },
                task: "Amati konversi AC ke DC",
                explanation: "Charger menggunakan switching power supply untuk efisiensi",
                difficulty: "sedang"
            },

            // Renewable Energy Sources (21-30)
            {
                id: 21,
                title: "Panel Surya 100W",
                category: "Energi Terbarukan",
                description: "Photovoltaic cell mengubah cahaya jadi listrik",
                leftObject: { name: "Positif Terminal", type: "output", voltage: 18 },
                rightObject: { name: "Negatif Terminal", type: "ground", voltage: 0 },
                connector: { name: "Silicon Cell", resistance: 3.24 },
                task: "Amati pengaruh intensitas cahaya terhadap output",
                explanation: "Panel surya menggunakan efek fotovoltaik",
                difficulty: "sedang"
            },
            {
                id: 22,
                title: "Turbin Angin Mini",
                category: "Energi Terbarukan",
                description: "Generator listrik dari energi angin",
                leftObject: { name: "Generator Output +", type: "output", voltage: "variable" },
                rightObject: { name: "Generator Output -", type: "ground", voltage: 0 },
                connector: { name: "Permanent Magnet Generator", resistance: 5 },
                task: "Ubah kecepatan angin untuk melihat output",
                explanation: "Turbin angin mengubah energi kinetik angin menjadi listrik",
                difficulty: "sedang"
            },
            {
                id: 23,
                title: "Fuel Cell 50W",
                category: "Energi Terbarukan",
                description: "Sel bahan bakar hidrogen",
                leftObject: { name: "Anoda (H2)", type: "output", voltage: 0.7 },
                rightObject: { name: "Katoda (O2)", type: "ground", voltage: 0 },
                connector: { name: "Elektrolit", resistance: 0.1 },
                task: "Simulasikan reaksi H2 + O2 → H2O + listrik",
                explanation: "Fuel cell mengubah energi kimia langsung jadi listrik",
                difficulty: "sulit"
            },
            {
                id: 24,
                title: "Hydroelectric Mini",
                category: "Energi Terbarukan",
                description: "Generator dari aliran air",
                leftObject: { name: "Turbine Output +", type: "output", voltage: "variable" },
                rightObject: { name: "Turbine Output -", type: "ground", voltage: 0 },
                connector: { name: "Water Turbine Generator", resistance: 2 },
                task: "Atur debit air untuk mengoptimalkan output",
                explanation: "PLTA mengubah energi potensial air menjadi listrik",
                difficulty: "sedang"
            },
            {
                id: 25,
                title: "Thermoelectric Generator",
                category: "Energi Terbarukan",
                description: "Generator dari perbedaan suhu",
                leftObject: { name: "Hot Side", type: "input", voltage: 0 },
                rightObject: { name: "Cold Side", type: "output", voltage: "variable" },
                connector: { name: "Seebeck Effect", resistance: 10 },
                task: "Buat perbedaan suhu untuk menghasilkan listrik",
                explanation: "TEG menggunakan efek Seebeck untuk konversi energi",
                difficulty: "sulit"
            },
            {
                id: 26,
                title: "Piezoelectric Generator",
                category: "Energi Terbarukan",
                description: "Generator dari tekanan mekanik",
                leftObject: { name: "Electrode +", type: "output", voltage: "pulse" },
                rightObject: { name: "Electrode -", type: "ground", voltage: 0 },
                connector: { name: "Piezo Crystal", resistance: 1000 },
                task: "Tekan kristal untuk menghasilkan pulsa listrik",
                explanation: "Piezoelectric mengubah tekanan mekanik jadi listrik",
                difficulty: "sedang"
            },
            {
                id: 27,
                title: "Biomass Generator",
                category: "Energi Terbarukan",
                description: "Generator dari pembakaran biomassa",
                leftObject: { name: "Steam Turbine +", type: "output", voltage: 220 },
                rightObject: { name: "Ground", type: "ground", voltage: 0 },
                connector: { name: "Steam Generator", resistance: 0.5 },
                task: "Simulasikan pembakaran biomassa → uap → listrik",
                explanation: "Biomassa dibakar untuk menghasilkan uap penggerak turbin",
                difficulty: "sedang"
            },
            {
                id: 28,
                title: "Geothermal Generator",
                category: "Energi Terbarukan",
                description: "Generator dari panas bumi",
                leftObject: { name: "Steam Output +", type: "output", voltage: 220 },
                rightObject: { name: "Return Ground", type: "ground", voltage: 0 },
                connector: { name: "Geothermal Turbine", resistance: 0.3 },
                task: "Manfaatkan panas bumi untuk menghasilkan uap",
                explanation: "Geothermal menggunakan panas dari dalam bumi",
                difficulty: "sedang"
            },
            {
                id: 29,
                title: "Wave Energy Converter",
                category: "Energi Terbarukan",
                description: "Generator dari gelombang laut",
                leftObject: { name: "Wave Generator +", type: "output", voltage: "variable" },
                rightObject: { name: "Sea Ground", type: "ground", voltage: 0 },
                connector: { name: "Oscillating Water Column", resistance: 8 },
                task: "Simulasikan gelombang laut menggerakkan generator",
                explanation: "Energi gelombang diubah menjadi gerakan mekanik lalu listrik",
                difficulty: "sulit"
            },
            {
                id: 30,
                title: "Tidal Energy Generator",
                category: "Energi Terbarukan",
                description: "Generator dari pasang surut air laut",
                leftObject: { name: "Tidal Turbine +", type: "output", voltage: "variable" },
                rightObject: { name: "Sea Ground", type: "ground", voltage: 0 },
                connector: { name: "Underwater Turbine", resistance: 4 },
                task: "Amati siklus pasang surut menghasilkan listrik",
                explanation: "Pasang surut menggerakkan turbin bawah laut",
                difficulty: "sulit"
            },

            // Energy Storage Systems (31-40)
            {
                id: 31,
                title: "Baterai Lithium-ion",
                category: "Penyimpanan Energi",
                description: "Baterai isi ulang untuk perangkat modern",
                leftObject: { name: "Anoda (Li)", type: "terminal", voltage: 3.7 },
                rightObject: { name: "Katoda (LiCoO2)", type: "terminal", voltage: 0 },
                connector: { name: "Elektrolit", resistance: 0.05 },
                task: "Simulasikan proses charge dan discharge",
                explanation: "Li-ion memiliki densitas energi tinggi dan siklus hidup panjang",
                difficulty: "sedang"
            },
            {
                id: 32,
                title: "Supercapacitor",
                category: "Penyimpanan Energi",
                description: "Kapasitor dengan kapasitas sangat besar",
                leftObject: { name: "Electrode +", type: "terminal", voltage: 2.7 },
                rightObject: { name: "Electrode -", type: "terminal", voltage: 0 },
                connector: { name: "Electrolyte", resistance: 0.001 },
                task: "Bandingkan kecepatan charge/discharge dengan baterai",
                explanation: "Supercapacitor dapat charge/discharge sangat cepat",
                difficulty: "sedang"
            },
            {
                id: 33,
                title: "Flywheel Energy Storage",
                category: "Penyimpanan Energi",
                description: "Penyimpanan energi kinetik dalam roda putar",
                leftObject: { name: "Motor/Generator +", type: "bidirectional", voltage: "variable" },
                rightObject: { name: "Ground", type: "ground", voltage: 0 },
                connector: { name: "Rotating Mass", resistance: 0.1 },
                task: "Putar flywheel untuk menyimpan energi kinetik",
                explanation: "Flywheel menyimpan energi dalam bentuk rotasi",
                difficulty: "sulit"
            },
            {
                id: 34,
                title: "Compressed Air Storage",
                category: "Penyimpanan Energi",
                description: "Penyimpanan energi dalam udara terkompresi",
                leftObject: { name: "Compressor Input", type: "input", voltage: 220 },
                rightObject: { name: "Generator Output", type: "output", voltage: 220 },
                connector: { name: "Air Tank + Turbine", resistance: "variable" },
                task: "Kompresi udara saat surplus, lepas saat butuh listrik",
                explanation: "CAES menyimpan energi dalam bentuk udara bertekanan",
                difficulty: "sulit"
            },
            {
                id: 35,
                title: "Pumped Hydro Storage",
                category: "Penyimpanan Energi",
                description: "Penyimpanan energi dengan memompa air ke atas",
                leftObject: { name: "Pump Motor", type: "input", voltage: 220 },
                rightObject: { name: "Turbine Generator", type: "output", voltage: 220 },
                connector: { name: "Water Reservoir", resistance: 0.2 },
                task: "Pompa air ke atas saat surplus, turun saat butuh listrik",
                explanation: "Pumped hydro adalah teknologi penyimpanan energi terbesar",
                difficulty: "sedang"
            },
            {
                id: 36,
                title: "Hydrogen Storage",
                category: "Penyimpanan Energi",
                description: "Penyimpanan energi dalam bentuk gas hidrogen",
                leftObject: { name: "Electrolyzer", type: "input", voltage: 12 },
                rightObject: { name: "Fuel Cell", type: "output", voltage: 12 },
                connector: { name: "H2 Tank", resistance: 0.1 },
                task: "Elektrolisis air jadi H2, lalu fuel cell jadi listrik",
                explanation: "Hidrogen dapat menyimpan energi dalam jangka panjang",
                difficulty: "sulit"
            },
            {
                id: 37,
                title: "Thermal Energy Storage",
                category: "Penyimpanan Energi",
                description: "Penyimpanan energi dalam bentuk panas",
                leftObject: { name: "Heater Input", type: "input", voltage: 220 },
                rightObject: { name: "Thermoelectric Output", type: "output", voltage: 12 },
                connector: { name: "Molten Salt", resistance: 0.5 },
                task: "Panaskan material penyimpan, konversi balik jadi listrik",
                explanation: "TES menggunakan material dengan kapasitas panas tinggi",
                difficulty: "sedang"
            },
            {
                id: 38,
                title: "Gravity Energy Storage",
                category: "Penyimpanan Energi",
                description: "Penyimpanan energi dengan mengangkat massa",
                leftObject: { name: "Lift Motor", type: "input", voltage: 220 },
                rightObject: { name: "Drop Generator", type: "output", voltage: 220 },
                connector: { name: "Heavy Mass", resistance: 0.1 },
                task: "Angkat massa saat surplus, turunkan saat butuh listrik",
                explanation: "Gravity storage menggunakan energi potensial gravitasi",
                difficulty: "sedang"
            },
            {
                id: 39,
                title: "Magnetic Energy Storage",
                category: "Penyimpanan Energi",
                description: "Penyimpanan energi dalam medan magnet",
                leftObject: { name: "Superconducting Coil +", type: "terminal", voltage: 12 },
                rightObject: { name: "Superconducting Coil -", type: "terminal", voltage: 0 },
                connector: { name: "Magnetic Field", resistance: 0 },
                task: "Simpan energi dalam medan magnet superkonduktor",
                explanation: "SMES menggunakan kumparan superkonduktor",
                difficulty: "sulit"
            },
            {
                id: 40,
                title: "Phase Change Storage",
                category: "Penyimpanan Energi",
                description: "Penyimpanan energi dalam perubahan fase material",
                leftObject: { name: "Heat Input", type: "input", voltage: 220 },
                rightObject: { name: "Heat Output", type: "output", voltage: 220 },
                connector: { name: "PCM (Paraffin)", resistance: 1 },
                task: "Lelehkan PCM untuk menyimpan, bekukan untuk melepas energi",
                explanation: "PCM menyimpan energi laten saat perubahan fase",
                difficulty: "sedang"
            },

            // Smart Grid & IoT (41-50)
            {
                id: 41,
                title: "Smart Meter",
                category: "Smart Grid",
                description: "Meteran listrik pintar dengan komunikasi 2-arah",
                leftObject: { name: "Grid Connection", type: "input", voltage: 220 },
                rightObject: { name: "Home Load", type: "output", voltage: 220 },
                connector: { name: "Digital Meter + Comm", resistance: 0.01 },
                task: "Monitor konsumsi real-time dan kirim data ke utility",
                explanation: "Smart meter memungkinkan monitoring dan kontrol jarak jauh",
                difficulty: "sedang"
            },
            {
                id: 42,
                title: "Home Energy Management",
                category: "Smart Grid",
                description: "Sistem manajemen energi rumah pintar",
                leftObject: { name: "Grid Input", type: "input", voltage: 220 },
                rightObject: { name: "Managed Loads", type: "output", voltage: 220 },
                connector: { name: "AI Controller", resistance: 0.05 },
                task: "Optimalkan penggunaan energi berdasarkan tarif dan kebutuhan",
                explanation: "HEMS mengoptimalkan konsumsi energi secara otomatis",
                difficulty: "sulit"
            },
            {
                id: 43,
                title: "Vehicle-to-Grid (V2G)",
                category: "Smart Grid",
                description: "Mobil listrik sebagai penyimpan energi grid",
                leftObject: { name: "Grid Connection", type: "bidirectional", voltage: 220 },
                rightObject: { name: "EV Battery", type: "bidirectional", voltage: 400 },
                connector: { name: "Bidirectional Charger", resistance: 0.1 },
                task: "Charge EV saat murah, discharge ke grid saat mahal",
                explanation: "V2G memungkinkan EV menjadi penyimpan energi mobile",
                difficulty: "sulit"
            },
            {
                id: 44,
                title: "Microgrid Controller",
                category: "Smart Grid",
                description: "Pengontrol jaringan listrik skala kecil",
                leftObject: { name: "Main Grid", type: "input", voltage: 220 },
                rightObject: { name: "Local Loads", type: "output", voltage: 220 },
                connector: { name: "Microgrid Controller", resistance: 0.02 },
                task: "Kelola sumber energi lokal dan koneksi ke grid utama",
                explanation: "Microgrid dapat beroperasi mandiri atau terhubung grid",
                difficulty: "sulit"
            },
            {
                id: 45,
                title: "Demand Response System",
                category: "Smart Grid",
                description: "Sistem respons permintaan otomatis",
                leftObject: { name: "Utility Signal", type: "input", voltage: "signal" },
                rightObject: { name: "Load Control", type: "output", voltage: 220 },
                connector: { name: "DR Controller", resistance: 0.01 },
                task: "Kurangi beban saat grid stress, normal saat grid stabil",
                explanation: "DR membantu stabilitas grid dengan mengatur beban",
                difficulty: "sedang"
            },
            {
                id: 46,
                title: "IoT Energy Sensor",
                category: "Smart Grid",
                description: "Sensor IoT untuk monitoring energi",
                leftObject: { name: "Power Line", type: "input", voltage: 220 },
                rightObject: { name: "Cloud Data", type: "output", voltage: "data" },
                connector: { name: "Current Transformer + WiFi", resistance: 0.001 },
                task: "Ukur konsumsi dan kirim data ke cloud untuk analisis",
                explanation: "IoT sensor memungkinkan monitoring energi real-time",
                difficulty: "sedang"
            },
            {
                id: 47,
                title: "Blockchain Energy Trading",
                category: "Smart Grid",
                description: "Platform trading energi peer-to-peer",
                leftObject: { name: "Producer (Solar)", type: "input", voltage: 220 },
                rightObject: { name: "Consumer", type: "output", voltage: 220 },
                connector: { name: "Blockchain Smart Contract", resistance: 0.01 },
                task: "Jual surplus solar ke tetangga melalui blockchain",
                explanation: "Blockchain memungkinkan trading energi tanpa perantara",
                difficulty: "sulit"
            },
            {
                id: 48,
                title: "AI Load Forecasting",
                category: "Smart Grid",
                description: "Prediksi beban menggunakan AI",
                leftObject: { name: "Historical Data", type: "input", voltage: "data" },
                rightObject: { name: "Load Prediction", type: "output", voltage: "forecast" },
                connector: { name: "Neural Network", resistance: 0 },
                task: "Prediksi konsumsi energi 24 jam ke depan",
                explanation: "AI membantu prediksi beban untuk optimasi grid",
                difficulty: "sulit"
            },
            {
                id: 49,
                title: "Dynamic Pricing System",
                category: "Smart Grid",
                description: "Sistem tarif listrik dinamis real-time",
                leftObject: { name: "Grid Condition", type: "input", voltage: "signal" },
                rightObject: { name: "Price Signal", type: "output", voltage: "price" },
                connector: { name: "Pricing Algorithm", resistance: 0 },
                task: "Atur tarif berdasarkan supply-demand real-time",
                explanation: "Dynamic pricing mendorong efisiensi penggunaan energi",
                difficulty: "sedang"
            },
            {
                id: 50,
                title: "Grid Stability Monitor",
                category: "Smart Grid",
                description: "Monitor stabilitas jaringan listrik real-time",
                leftObject: { name: "Grid Sensors", type: "input", voltage: "signal" },
                rightObject: { name: "Control Actions", type: "output", voltage: "control" },
                connector: { name: "Stability Algorithm", resistance: 0 },
                task: "Monitor frekuensi dan tegangan, ambil aksi korektif",
                explanation: "Grid stability monitor menjaga kualitas dan keandalan listrik",
                difficulty: "sulit"
            }
        ];
    }

    getCurrentExperiment() {
        return this.experiments[this.currentExperiment];
    }

    nextExperiment() {
        if (this.currentExperiment < this.experiments.length - 1) {
            this.currentExperiment++;
            return true;
        }
        return false;
    }

    previousExperiment() {
        if (this.currentExperiment > 0) {
            this.currentExperiment--;
            return true;
        }
        return false;
    }

    markCompleted() {
        this.completedExperiments.add(this.currentExperiment);
        this.score += this.getDifficultyPoints();
    }

    getDifficultyPoints() {
        const difficulty = this.getCurrentExperiment().difficulty;
        switch(difficulty) {
            case 'mudah': return 10;
            case 'sedang': return 20;
            case 'sulit': return 30;
            default: return 10;
        }
    }

    getProgress() {
        return {
            completed: this.completedExperiments.size,
            total: this.experiments.length,
            percentage: (this.completedExperiments.size / this.experiments.length) * 100,
            score: this.score
        };
    }

    getExperimentsByCategory(category) {
        return this.experiments.filter(exp => exp.category === category);
    }

    getCategories() {
        return [...new Set(this.experiments.map(exp => exp.category))];
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElectricalExperiments;
}