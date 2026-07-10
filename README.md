# Technoskill-2026
Nama: Tobias Sutanto

Link file exe: https://drive.google.com/drive/folders/1Qz3Ri9lrbHVup3Ew-HT09GWvg8i-iTTV?usp=sharing
dalam zip itu, ada file .exe yang bisa dijalankan

**Konsep**:
Game dungeon-crawler dengan konsep turn-based combat. Poin didapat dari mengalahkan musuh.

**Fitur**:
- Turn-based combat dengan HP dan mana yang dimiliki oleh karakter user. HP dan mana akan bertambah seiring bertambahnya level karakter.
- Mengalahkan musuh akan memberikan XP dan musuh akan memberikan drop random, diantara health orb (hijau) yang akan menambah HP, mana orb (biru) yang akan menambah mana, dan ladder (coklat) yang akan menambah floor.
- Konsep floor terinspirasi dari game Stardew Valley, dimana ada sebuah cave yang memiliki level. Semakin dalam masuk ke dalam cave, musuh menjadi semakin sulit.
- Konsep turn-based combat terinspirasi dari game Pokemon, terutama pokemon showdown.
- Nyawa dan damage musuh serta xp yang diberikan akan semakin banyak semakin tinggi floor nya.
- Semakin tinggi level, semakin tinggi nyawa, mana, dan damage.
- Setiap kali naik level, karakter akan memulihkan hp dan mana.
- Musuh memiliki beberapa opsi serangan tergantung dari tipe musuh (kuning, orange, merah).

Controls:
- W A S D untuk bergerak
- Click mouse untuk collect drop yang diberikan oleh musuh ketika karakter berada pada lokasi drop tersebut

**Speedy (kuning)**
HP rendah dengan damage tinggi
move list:
- Quick Attack (30 damage)
- Sharpen (meningkatkan damage)

**Normal (orange)**
HP dan damage sedang
move list:
- Slash (10 damage)
- Sharpen (meningkatkan damage)

**Boss (red)**
HP dan damage tinggi yang bisa memulihkan nyawa sendiri
move list:
- Bonk (30 damage)
- Big Bonk (50 damage)
- Snap (meningkatkan damage yang diberikan dan diterima sebanyak 25%)
- Pray (memulihkan 50% dari nyawa maksimal)

**User (biru)**
User memiliki serangan basic, skill, dan bisa menggunakan item

basic:
- Punch (100% base accuracy dan 10 damage)
- Bulk Up (100% base accuracy dan meningkatkan damage sebanyak 20%)
- Focus (80% base accuracy dan meningkatkan accuracy sebanyak 20%)
- Mega Punch (80% base accuracy dan 30 damage)

item (memiliki 3 untuk setiap item):
- Potion (meningkatkan hp sebanyak 20)
- Coffee (meningkatkan accuracy sebanyak 20)
- Strength Potion (meningkatkan damage sebanyak 20)
- Smoke Bomb (mengurangi accuracy musuh sebanyak 20)

skill:
- Fireball (menggunakan 20 mana dan memberikan 40 damage)
- Light Foot (mengurangi accuracy lawan sebanyak 40)
- Belly Drum (menggunakan 50% dari max hp karakter dan meningkatkan damage sebanyak 50%)
- Explosion (menggunakan 100 mana dan memberikan 100 damage)
run: kabur dari musuh dan tidak akan memberikan apa-apa

**Bagian yang paling sulit**
Dalam mode adventure, musuh akan spawn setiap 5 detik dengan maksimal 5 musuh. Fitur paling sulit dalam projek ini adalah masing-masing musuh yang spawn harus bisa memiliki pergerakan, stats, dan id masing-masing. Saya menyelesaikan bagian ini dengan cara membuat array kosong yang berisi koordinat, diameter, dan id serta data lainnya yang unik oleh setiap jenis musuh.
