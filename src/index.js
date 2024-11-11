//DEFINISI KELAS
class PriorityQueue {
  // Membuat constructor tanpa parameter
  constructor() {
    this.queue = [];
  }
  // Method enqueue digunakan untuk menambahkan elemen ke dalam antrian prioritas.
  enqueue(node) {
    this.queue.push(node);
    this.queue.sort((a, b) => a.cost - b.cost); // Mengurutkan elemen berdasarkan cost dari terkecil ke terbesar.
  }
  // Method dequeue digunakan untuk mengambil elemen terdepan dari antrian prioritas.
  dequeue() {
    return this.queue.shift();
  }
  // Method isEmpty digunakan untuk mengecek apakah antrian prioritas kosong atau tidak.
  isEmpty() {
    return this.queue.length === 0;
  }
}
class parrentNode {
  // Membuat constructor dengan parameter id, parent, dan cost
  constructor(id, parrent, cost) {
    this.id = id; // variabel untuk menyimpan id node
    this.parrent = parrent; // variabel untuk menyimpan node parrent
    this.cost = cost; // variabel untuk menyimpan cost dari node saat ini
  }
}
class Node {
  // Membuat constructor dengan parameter name, lat, dan lon
  constructor(name, lat, lon) {
    // Menyimpan nilai parameter name ke dalam properti name
    this.name = name;
    // Menyimpan nilai parameter lat ke dalam properti lat
    this.lat = lat;
    // Menyimpan nilai parameter lon ke dalam properti lon
    this.lon = lon;
  }
  // Membuat method getLatitudeLongitude
  getLatitudeLongitude() {
    // Deklarasi array coordinates yang berisi nilai properti lat dan lon
    const coordinates = [this.lat, this.lon];
    // Mengembalikan array coordinates
    return coordinates;
  }
  // Membuat method findDistance dengan parameter node
  findDistance(node) {
    // Deklarasi variabel distance dan menghitung jarak antara 2 node dengan menggunakan function calculateDistance dan parameter properti lat dan lon
    const distance = calculateDistance(this.lat, this.lon, node.lat, node.lon);
    // Mengembalikan nilai distance
    return distance;
  }
}

class Graph {
  constructor() {
    this.nodes = [];
    this.adjacentMatrix = [];
    this.nodeArea = L.layerGroup([]);
    this.edgePaths = L.layerGroup([]);
    this.shortestPath = L.layerGroup([]);
  }
  // fungsi untuk mendapatkan node berdasarkan nama
  getNode(name) {
    return this.nodes.find((node) => node.name === name);
  }
  // fungsi untuk menggambar marker node
  drawNodeMarker() {
    for (const node of this.nodes) {
      const circle = L.circle(node.getLatitudeLongitude(), { radius: 20 });
      circle.bindPopup(node.name);
      this.nodeArea.addLayer(circle);
    }
  }
  // fungsi untuk menggambar jalur edge
  drawEdgePath() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j <= i; j++) {
        if (this.adjacentMatrix[i][j] > 0) {
          const line = L.polyline([
            this.nodes[i].getLatitudeLongitude(),
            this.nodes[j].getLatitudeLongitude(),
          ]);
          line.bindPopup(String(this.adjacentMatrix[i][j]));
          line.setText(String(this.adjacentMatrix[i][j]), { center: true });
          this.edgePaths.addLayer(line);
        }
      }
    }
  }
  // fungsi untuk menggambar jalur terpendek
  drawPath(path, map) {
    this.shortestPath.clearLayers();
    let sum = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const from = this.getNode(path[i]);
      const to = this.getNode(path[i + 1]);
      const line = L.polyline(
        [from.getLatitudeLongitude(), to.getLatitudeLongitude()],
        { color: "red" }
      );
      this.shortestPath.addLayer(line);
      this.shortestPath.addTo(map);

      sum += calculateDistance(from.lat, from.lon, to.lat, to.lon);
    }
    const textsum = document.getElementById("sum-path");
    textsum.innerHTML = "Jarak Terpendek yg di temukan: " + sum.toString() + " km";
  }
  // fungsi untuk menggambar node dan edge pada peta
  draw(map) {
    this.drawNodeMarker();
    this.drawEdgePath();
    this.edgePaths.addTo(map);
    this.nodeArea.addTo(map);
  }
  // fungsi untuk membersihkan layer pada peta
  clear() {
    this.shortestPath.clearLayers();
    this.edgePaths.clearLayers();
    this.nodeArea.clearLayers();
  }
  // fungsi untuk mendapatkan indeks node berdasarkan nama
  getIndex(name) {
    return this.nodes.findIndex((x) => x.name === name);
  }
}

//DEFINISI FUNGSI HELPER
// Membuat fungsi calculateDistance dengan parameter latitude1, longitude1, latitude2, dan longitude2
function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
  // Menetapkan konstanta R dengan nilai 6371 yang merupakan radius bumi dalam km
  const R = 6371;
  // Mengubah perbedaan latitude menjadi radian dan menyimpannya dalam variabel _latitude
  const _latitude = derajatToRadian(latitude2 - latitude1);
  // Mengubah perbedaan longitude menjadi radian dan menyimpannya dalam variabel _longitude
  const _longitude = derajatToRadian(longitude2 - longitude1);
  // Menghitung nilai a menggunakan rumus haversine formula
  const a =
    Math.sin(_latitude / 2) * Math.sin(_latitude / 2) +
    Math.cos(derajatToRadian(latitude1)) *
      Math.cos(derajatToRadian(latitude2)) *
      Math.sin(_longitude / 2) *
      Math.sin(_longitude / 2);
  // Menghitung nilai c menggunakan rumus haversine formula
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Menghitung nilai d (jarak) menggunakan rumus haversine formula dan radius bumi R
  const d = R * c;
  // Mengembalikan nilai d (jarak)
  return d;
}

// Membuat fungsi derajatToRadian dengan parameter degree
function derajatToRadian(degree) {
  // Menghitung nilai radian dengan rumus degree * Math.PI / 180
  const radian = (degree * Math.PI) / 180;
  // Mengembalikan nilai radian
  return radian;
}

// fungsi yang akan dijalankan ketika pengguna mengklik peta
function onMapClick(e) {
  alert("You clicked the map at " + e.latlng);
}

//VARIABEL GLOBAL
// Inisialisasi peta dengan koordinat tertentu
let map = L.map("mapid").setView([-6.40486, 106.74200], 17);
function setView() {
  var view = document.getElementById("view").value;
  switch (view) {
    case "depok":
      map.setView([-6.4025, 106.8186], 17);
      break;
    case "bojongsari":
      map.setView([-6.40486, 106.74200], 17);
      break;
    case "Tangerang":
      map.setView([-6.3441, 106.73713], 17);

    default:
      break;
  }
}
// Membuat objek Graph baru
const graph = new Graph();
// Menambahkan tile layer pada peta
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
// Menambahkan marker pada peta
L.marker([-6.40486, 106.74200]).addTo(map).bindPopup("Bojongsari").openPopup();
L.marker([-6.40486, 106.74200]).addTo(map).bindPopup("Bojongsari");
L.marker([-6.4025, 106.8186]).addTo(map).bindPopup("Depok");
L.marker([-6.34619, 106.69132]).addTo(map).bindPopup("Pamulang Viktor");




document.getElementById("mapid").classList.add("show");

// Fungsi untuk membaca dataset
const readDataset = (event) => {
  // Buat objek FileReader
  let dataset = new FileReader();
  // Ketika FileReader selesai membaca dataset
  dataset.onload = function (event) {
    // Parsing data dari format JSON ke objek JavaScript
    var data = JSON.parse(event.target.result);
    // Panggil fungsi main dengan parameter nodes dan edges dari data
    main(data.nodes, data.edges);
  };
  // Baca file dataset yang diupload oleh pengguna
  dataset.readAsText(event.target.files[0]);
};

// Fungsi untuk menampilkan jalur terpendek antara dua node.
const main = (nodes, edges) => {
  // Menghapus semua node dan edge yang ada pada peta.
  graph.clear();
  // Menghapus elemen pada dropdown list dari node asal dan tujuan.
  let from = document.getElementById("from-node");
  let goal = document.getElementById("to-node");
  let i = 0;
  if (from.length != 0 || goal.length != 0) {
    while (from.length != 0 && goal.length != 0) {
      from.remove(from.i);
      goal.remove(goal.i);
      i++;
    }
  }
  // Inisialisasi array untuk menyimpan node-node dari graf.
  let nodeArr = [];
  for (let node of nodes) {
    let tnode = new Node(node.name, node.lat, node.lon);
    nodeArr.push(tnode);
  }
  // Tambahkan elemen pada dropdown list untuk node asal dan tujuan.
  for (let node of nodes) {
    let elmtfrom = document.createElement("option");
    let elmtto = document.createElement("option");
    elmtfrom.text = node.name;
    elmtto.text = node.name;
    document.getElementById("from-node").add(elmtfrom);
    document.getElementById("to-node").add(elmtto);
  }
  // Set node-node pada graf.
  graph.nodes = nodeArr;
  // Inisialisasi matriks adjacency untuk graf.
  let matrix = edges;
  for (let i = 0; i < graph.nodes.length; i++) {
    for (let j = 0; j < i + 1; j++) {
      if (matrix[i][j] == 1) {
        let dist = calculateDistance(
          nodeArr[i].lat,
          nodeArr[i].lon,
          nodeArr[j].lat,
          nodeArr[j].lon
        );
        matrix[i][j] = dist.toPrecision(4);
        matrix[j][i] = dist.toPrecision(4);
      }
    }
  }
  graph.adjacentMatrix = matrix;
  graph.draw(map);
};


// FUNGSI A*
function Astar() {
  // Deklarasi variabel
  let fromnode = document.getElementById("from-node");
  let goalnode = document.getElementById("to-node");
  let startname = fromnode.options[fromnode.selectedIndex].text;
  let goal = goalnode.options[goalnode.selectedIndex].text;
  let unvisited = [];
  let start = {
    name: startname,
    prev: null,
    fValue: undefined,
    cost: undefined,
  };
  // Memanggil fungsi Astaralgorithm untuk mencari jalur terpendek
  let path = Astaralgorithm(start, goal, 0, unvisited);
  // Memutar urutan jalur
  path.reverse();
  // Menggambar jalur pada peta
  graph.drawPath(path, map);
  // Mengembalikan jalur terpendek
  return path;
}

function Astaralgorithm(current, goal, gValue, unvisited) {
  // Jika node yang sedang diperiksa adalah node tujuan, maka kembalikan jalur yang telah ditemukan
  if (current.name == goal) {
    let path = [];
    while (current != null) {
      path.push(current.name);
      current = current.prev;
    }
    return path;
  }
  // Mencari indeks node saat ini di dalam graph
  let currIdx = graph.getIndex(current.name);
  // Memasukkan node yang terhubung dengan node saat ini ke dalam array unvisited
  for (let i = 0; i < graph.nodes.length; i++) {
    if (graph.adjacentMatrix[currIdx][i] > 0) {
      let toVisit = {};
      toVisit.name = graph.nodes[i].name;
      toVisit.prev = current;
      toVisit.cost = Number(graph.adjacentMatrix[currIdx][i]);

      // Menghitung fValue, yaitu perkiraan jarak terpendek dari node saat ini ke node tujuan melalui node yang sedang dipertimbangkan
      toVisit.fValue =
        Number(graph.nodes[i].findDistance(graph.getNode(goal))) +
        Number(gValue) +
        Number(graph.adjacentMatrix[currIdx][i]);
      unvisited.push(toVisit);
    }
  }
  // Mencari node selanjutnya dengan fValue terkecil
  let minIdx = 0;
  for (let i = 1; i < unvisited.length; i++) {
    if (unvisited[i].fValue < unvisited[minIdx].fValue) {
      minIdx = i;
    }
  }
  // Mengambil node selanjutnya dan menghitung nilai gValue yang baru
  let next = unvisited.splice(minIdx, 1);
  let newG = gValue + next[0].cost;
  // Melakukan rekursi untuk mencari jalur terpendek dari node selanjutnya ke node tujuan
  return Astaralgorithm(next[0], goal, newG, unvisited);
}

// Fungsi untuk menjalankan algoritma yang dipilih
function runAlgorithm() {
  // Mendapatkan nilai dropdown "algorithm"
  const algorithm = document.getElementById("algorithm").value;
  // Jika nilai dropdown "algorithm" adalah "astar", jalankan algoritma A*
  if (algorithm === "astar") {
    Astar();
  }

}
