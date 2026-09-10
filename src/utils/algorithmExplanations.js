// ─── IN-DEPTH ALGORITHM EXPLANATIONS ───────────────────────────────────────
// Each entry answers two questions for a curious/confused learner:
// how the algorithm actually works, and where it shows up in the real world.

const EXPLANATIONS = {
  bubble: {
    tr: {
      howItWorks: [
        'Bubble Sort, diziyi soldan sağa tarayarak bitişik iki elemanı sürekli karşılaştırır. Soldaki eleman sağdakinden büyükse ikisi yer değiştirir; değilse dizi olduğu gibi kalır.',
        'Bu taramaya bir "geçiş" (pass) denir. Her geçişin sonunda, o ana kadarki en büyük eleman kabarcık gibi dizinin sonuna doğru yükselir — algoritmanın adı da buradan gelir.',
        'Dizi tamamen sıralı olana kadar geçişler tekrarlanır. Her geçişte en az bir eleman kesin doğru konumuna yerleştiği için, n elemanlı bir dizi en fazla n-1 geçişte sıralanır.',
      ],
      useCases: [
        'Algoritmik düşünmeyi öğretmek için ideal — basit ve görselleştirmesi kolay',
        'Çok küçük veya neredeyse sıralı dizilerde pratik kullanım',
        'Bir dizinin zaten sıralı olup olmadığını tek geçişte (hiç takas olmadıysa) tespit etmek',
        'Bellek kısıtı çok sıkı gömülü sistemlerde, kod basitliğinin hızdan daha önemli olduğu durumlar',
      ],
    },
    en: {
      howItWorks: [
        'Bubble Sort scans the array left to right, repeatedly comparing each pair of neighboring elements. If the left one is bigger than the right one, they swap; otherwise they stay put.',
        'One full scan is called a "pass". By the end of each pass, the largest remaining value has bubbled up to its correct spot at the end — which is where the algorithm gets its name.',
        'Passes repeat until no swaps are needed. Since each pass guarantees at least one element lands in its final position, an array of n elements is fully sorted in at most n-1 passes.',
      ],
      useCases: [
        'Teaching algorithmic thinking — simple to explain and easy to visualize',
        'Practical only for tiny or nearly-sorted arrays',
        'Detecting whether a list is already sorted in a single pass (no swaps happened)',
        'Extremely memory-constrained embedded systems where code simplicity matters more than speed',
      ],
    },
  },

  selection: {
    tr: {
      howItWorks: [
        'Selection Sort, diziyi sıralanmamış ve sıralanmış iki bölgeye ayırır (başta tüm dizi sıralanmamıştır). Her adımda sıralanmamış bölgenin tamamı taranıp en küçük eleman bulunur.',
        'Bulunan bu en küçük eleman, sıralanmamış bölgenin ilk elemanıyla yer değiştirir. Böylece sıralanmış bölge bir eleman büyür, sıralanmamış bölge bir eleman küçülür.',
        'Bu işlem sıralanmamış bölge tükenene kadar tekrarlanır. Bubble Sort\'tan farkı: her adımda sadece bir takas yapılır (toplamda n kez) — takas maliyeti yüksekse bu avantajlıdır.',
      ],
      useCases: [
        'Takas işleminin karşılaştırmadan çok daha maliyetli olduğu durumlar (örn. büyük kayıtları diskte taşımak)',
        'Küçük veri kümeleri ve öğretim amaçlı gösterimler',
        'Ekstra bellek kullanmadan (in-place) sıralama gerektiren basit sistemler',
        'Sıralama ağları ve donanım seviyesinde sabit sayıda işlem gereken senaryolar',
      ],
    },
    en: {
      howItWorks: [
        'Selection Sort splits the array into a sorted region and an unsorted region (at the start, everything is unsorted). Each step scans the entire unsorted region to find its smallest element.',
        'That smallest element is swapped with the first element of the unsorted region, growing the sorted region by one and shrinking the unsorted region by one.',
        'This repeats until nothing is left unsorted. Unlike Bubble Sort, it performs only one swap per pass (n swaps total), which helps when swapping is expensive.',
      ],
      useCases: [
        'Situations where swapping is far more expensive than comparing (e.g. moving large records on disk)',
        'Small datasets and classroom demonstrations',
        'Simple in-place sorting with no extra memory',
        'Sorting networks and hardware contexts needing a fixed, predictable number of operations',
      ],
    },
  },

  insertion: {
    tr: {
      howItWorks: [
        'Insertion Sort, iskambil kağıtlarını elinizde sıralamaya benzer: ilk eleman zaten "sıralı" sayılır, sonra her yeni eleman alınıp kendisinden önceki sıralı kısımdaki doğru konuma kaydırılarak yerleştirilir.',
        'Yeni eleman (key), soldaki sıralı bölümde kendisinden büyük elemanlar bulduğu sürece onları bir sağa kaydırır; kendisinden küçük/eşit bir elemana rastlayınca (ya da dizinin başına ulaşınca) durup oraya yerleşir.',
        'Bu yüzden zaten sıralı ya da sıralıya yakın dizilerde çok hızlıdır (en iyi durumda O(n)) — her eleman doğru yerdeyse hiç kaydırma yapılmaz.',
      ],
      useCases: [
        'Küçük diziler veya neredeyse sıralı veriler — adaptif davranışı sayesinde çok hızlı çalışır',
        'Timsort ve Introsort gibi hibrit sıralama algoritmalarının küçük alt dizilerde kullandığı temel yöntem',
        'Akan veri: elemanlar teker teker geldiğinde (örn. anlık skor tablosu) her yeni elemanı doğru yere eklemek',
        'Tüm veriyi önceden görmeden işlem yapılması gereken çevrimiçi (online) sıralama senaryoları',
      ],
    },
    en: {
      howItWorks: [
        'Insertion Sort works like sorting a hand of playing cards: the first element is treated as already "sorted", and every following element is picked up and slid into its correct spot among the sorted elements to its left.',
        'The new element (the "key") shifts every larger element in the sorted part one slot to the right until it finds one that\'s smaller or equal (or reaches the start), then drops into that gap.',
        'That\'s why it\'s very fast on data that\'s already sorted or nearly sorted (best case O(n)) — if every element is already in place, no shifting happens at all.',
      ],
      useCases: [
        'Small arrays or nearly-sorted data, where its adaptive behavior makes it very fast',
        'The base case that hybrid sorts like Timsort and Introsort switch to for small sub-arrays',
        'Online/streaming sorting: inserting new elements one at a time as they arrive, e.g. a live leaderboard',
        'Any scenario where data must be sorted incrementally without seeing all of it upfront',
      ],
    },
  },

  merge: {
    tr: {
      howItWorks: [
        'Merge Sort "böl ve yönet" stratejisini kullanır: diziyi ortadan ikiye böler, her yarıyı kendini tekrar çağırarak (recursive) ayrı ayrı sıralar, sonra iki sıralı yarıyı birleştirir.',
        'Birleştirme adımında iki sıralı alt dizinin en baştaki elemanları karşılaştırılır; küçük olan sonuç dizisine alınır ve o alt dizide bir ileri gidilir. Bu, her iki alt dizi de tükenene kadar sürer.',
        'Bölme işlemi dizi tek elemana inene kadar sürer (tek eleman zaten sıralıdır), ardından birleştirmeler alttan üste doğru gerçekleşir. Bu yapı en kötü durumda dahi garantili O(n log n) performans sağlar.',
      ],
      useCases: [
        'Çok büyük veri kümelerini diskte sıralamak (external sorting) — parçalar halinde sıralanıp birleştirilir',
        'Kararlı (stable) sıralama gereken durumlar, örn. bir listeyi önce isme sonra tarihe göre sıralamak',
        'Bağlı listelerin (linked list) sıralanması — rastgele erişime ihtiyaç duymadığı için çok uygundur',
        'Python\'un sorted() ve Java\'nın nesne dizilerinde kullandığı Timsort gibi birçok standart kütüphane sıralamasının temeli',
      ],
    },
    en: {
      howItWorks: [
        'Merge Sort uses a "divide and conquer" strategy: it splits the array in half, recursively sorts each half on its own, then merges the two sorted halves back together.',
        'During the merge step, it compares the front elements of the two sorted sub-arrays; the smaller one is taken into the result and that sub-array advances by one. This continues until both are exhausted.',
        'The splitting continues until each piece is a single element (trivially sorted), then merges happen bottom-up. This structure guarantees O(n log n) performance even in the worst case.',
      ],
      useCases: [
        'Sorting huge datasets that don\'t fit in memory (external sorting) — sorted chunks on disk are merged together',
        'Anywhere a stable sort is required, e.g. sorting a list by name and then by date without disturbing ties',
        'Sorting linked lists, since it never needs random access to elements',
        'The foundation of many standard-library sorts, like the Timsort variant used by Python\'s sorted() and Java\'s object array sort',
      ],
    },
  },

  binarySearch: {
    tr: {
      howItWorks: [
        'Binary Search sadece sıralı dizilerde çalışır. Aranan değeri dizinin tam ortasındaki elemanla karşılaştırarak başlar.',
        'Orta eleman aranan değere eşitse arama biter. Aranan değer ortadakinden küçükse arama sadece sol yarıda, büyükse sadece sağ yarıda devam eder — diğer yarı tamamen elenir.',
        'Bu yarıya bölme işlemi, arama aralığı tek elemana inene veya değer bulunana kadar tekrarlanır. Her adımda arama alanı yarıya indiği için, milyonlarca elemanlı bir dizide bile sadece ~20 adımda sonuca ulaşılır.',
      ],
      useCases: [
        'Sıralı büyük veri kümelerinde (veritabanı indeksleri, sözlükler) hızlı arama',
        'git bisect: hangi commit\'in hatayı getirdiğini bulmak için commit geçmişinde ikili arama yapar',
        'Otomatik tamamlama ve sözlük uygulamalarında kelime arama',
        'Monoton (sürekli artan/azalan) bir fonksiyonun belirli bir değeri aldığı noktayı bulmak',
      ],
    },
    en: {
      howItWorks: [
        'Binary Search only works on sorted arrays. It starts by comparing the target value to the element exactly in the middle of the array.',
        'If the middle element equals the target, the search is done. If the target is smaller, it continues only in the left half; if larger, only in the right half — the other half is discarded entirely.',
        'This halving repeats until the range narrows to a single element or the value is found. Because the search space halves every step, even an array with millions of elements resolves in roughly 20 steps.',
      ],
      useCases: [
        'Fast lookups in large sorted datasets — database indexes, dictionaries',
        'git bisect: binary-searching through commit history to find which commit introduced a bug',
        'Autocomplete and dictionary word lookups',
        'Finding where a monotonic (steadily increasing/decreasing) function crosses a value',
      ],
    },
  },

  linearSearch: {
    tr: {
      howItWorks: [
        'Linear Search en basit arama yöntemidir: dizinin ilk elemanından başlayarak, aranan değeri bulana veya dizinin sonuna gelene kadar her elemanı tek tek kontrol eder.',
        'Dizinin sıralı olması gerekmez — herhangi bir sırada dizilmiş elemanlarda çalışır. Bu esneklik, basitliğinin bedeli olarak yavaşlığı (en kötü durumda O(n)) getirir.',
        'Değer dizinin başındaysa çok hızlı, sonundaysa veya yoksa tüm diziyi taramak gerekir. Ortalama olarak, elemanların yarısı kadarı taranır.',
      ],
      useCases: [
        'Sıralanmamış veya çok küçük dizilerde arama',
        'Bağlı listeler gibi rastgele erişime izin vermeyen veri yapılarında (Binary Search burada kullanılamaz)',
        'Tek seferlik aramalarda; diziyi önce sıralamanın maliyeti aramanın kendisinden daha yüksek olduğunda',
        'Belirli bir özelliğe göre indekslenmemiş verilerde arama, örn. bir listedeki "ilk çift sayı"',
      ],
    },
    en: {
      howItWorks: [
        'Linear Search is the simplest search method: starting from the first element, it checks each one in turn until it finds the target or runs out of elements.',
        'The array doesn\'t need to be sorted — it works on data in any order. That flexibility is the trade-off for its simplicity: worst case O(n).',
        'If the value is near the start, it\'s very fast; if it\'s near the end or missing, the whole array must be scanned. On average, about half the array gets checked.',
      ],
      useCases: [
        'Searching unsorted or very small arrays',
        'Data structures without random access, like linked lists, where Binary Search isn\'t possible',
        'One-off searches where sorting the data first would cost more than the search itself',
        'Finding an element by an unindexed property, e.g. "the first even number" in a list',
      ],
    },
  },

  bfs: {
    tr: {
      howItWorks: [
        'BFS (Genişlik Öncelikli Arama), başlangıç düğümünden itibaren grafı seviye seviye gezer: önce başlangıcın tüm doğrudan komşuları, sonra onların komşuları, ve böyle devam eder.',
        'Bunu bir kuyruk (queue, FIFO — ilk giren ilk çıkar) yapısıyla yönetir. Bir düğüm ziyaret edildiğinde henüz ziyaret edilmemiş tüm komşuları kuyruğa eklenir; kuyruğun başındaki düğüm alınıp işlenir, bu döngü kuyruk boşalana kadar sürer.',
        'Her kenarın "ağırlığı" aynı (1 birim) sayıldığından, BFS bir düğümü ilk ziyaret ettiği anda oraya olan yolun kesinlikle en kısa yol olduğunu garanti eder.',
      ],
      useCases: [
        'Ağırlıksız graflarda en kısa yolu bulmak (örn. bir haritada en az sayıda durakla hedefe gitmek)',
        'Sosyal ağlarda "X derece bağlantı" hesaplamak (arkadaşının arkadaşı önerileri)',
        'Web tarayıcılarının siteleri seviye seviye keşfetmesi',
        'Bulmaca/oyun çözücülerde en az hamleyle çözüme ulaşmayı garantilemek (örn. 15-puzzle)',
      ],
    },
    en: {
      howItWorks: [
        'BFS (Breadth-First Search) explores a graph level by level starting from a source node: first all of the source\'s direct neighbors, then their neighbors, and so on outward.',
        'It manages this with a queue (FIFO — first in, first out). When a node is visited, all of its unvisited neighbors are added to the queue; the node at the front of the queue is processed next, repeating until the queue is empty.',
        'Since every edge counts as the same distance (1 step), the moment BFS first visits a node, that path is guaranteed to be the shortest possible route to it.',
      ],
      useCases: [
        'Finding the shortest path in an unweighted graph, e.g. fewest stops to a destination on a map',
        'Computing "degrees of separation" in social networks (friend-of-a-friend suggestions)',
        'Web crawlers discovering pages level by level from a starting site',
        'Puzzle/game solvers that must guarantee the minimum number of moves to a solution (e.g. 15-puzzle)',
      ],
    },
  },

  dfs: {
    tr: {
      howItWorks: [
        'DFS (Derinlik Öncelikli Arama), bir dala girdiğinde mümkün olduğunca derine iner; gidebileceği yeni bir komşu kalmayınca geri döner (backtrack) ve başka bir dalı dener.',
        'Bu davranış doğal olarak bir yığın (stack, LIFO — son giren ilk çıkar) ile veya doğrudan özyineleme (recursion, ki bu da fonksiyon çağrı yığınını kullanır) ile uygulanır.',
        'BFS\'ten farklı olarak DFS en kısa yolu garanti etmez, ama bir düğümden erişilebilen her yolu sistematik olarak dener ve genelde daha az bellek kullanır.',
      ],
      useCases: [
        'Labirent ve bulmaca çözme (bir yolu deneyip çıkmaz sokaksa geri dönme mantığı)',
        'Topolojik sıralama: görevler arasında bağımlılık olduğunda doğru işlem sırasını bulmak (örn. bir yazılım projesinin derleme sırası)',
        'Bir grafta döngü (cycle) tespiti — örn. işletim sisteminde kilitlenme (deadlock) tespiti',
        'Oyun ağaçlarında (satranç, tic-tac-toe) olası hamleleri derinlemesine keşfetmek',
      ],
    },
    en: {
      howItWorks: [
        'DFS (Depth-First Search) dives as deep as possible down one branch before backtracking; once a node has no more unvisited neighbors, it steps back and tries a different branch.',
        'This is naturally implemented with a stack (LIFO — last in, first out) or, equivalently, with recursion (which uses the function call stack under the hood).',
        'Unlike BFS, DFS doesn\'t guarantee the shortest path, but it systematically explores every reachable path from a node and typically uses less memory.',
      ],
      useCases: [
        'Maze and puzzle solving — try a path, and backtrack if it\'s a dead end',
        'Topological sorting: finding a valid order when tasks depend on each other (e.g. the build order of a software project)',
        'Detecting cycles in a graph — for example, deadlock detection in an operating system',
        'Exploring possible moves in game trees (chess, tic-tac-toe)',
      ],
    },
  },

  treePreorder: {
    tr: {
      howItWorks: [
        'Preorder gezintisinde önce kök düğüm ziyaret edilir, ardından sol alt ağacın tamamı (yine preorder mantığıyla), en son sağ alt ağacın tamamı gezilir.',
        'Bu sıralama bir düğümü her zaman kendi alt ağacından önce ziyaret ettiği için, ağacın "üstten aşağıya" yapısını doğal olarak yansıtır.',
      ],
      useCases: [
        'Bir ağaç yapısını kopyalamak/klonlamak — önce kökü oluşturup sonra alt ağaçları eklemek bu sırayla ilerler',
        'Bir ağacı diske kaydetmek (serileştirmek): preorder sırayla kaydedilen bir ağaç, aynı sırayla okunarak orijinal yapısıyla yeniden kurulabilir',
        'İfade ağaçlarından prefix (Polish) notasyon üretmek',
      ],
    },
    en: {
      howItWorks: [
        'In Preorder traversal, the root is visited first, then the entire left subtree (again in preorder), and finally the entire right subtree.',
        'Because a node is always visited before its own subtree, this order naturally mirrors the tree\'s top-down structure.',
      ],
      useCases: [
        'Copying/cloning a tree — creating the root first and then attaching subtrees follows this exact order',
        'Serializing a tree to disk: a tree saved in preorder can be read back in the same order to reconstruct its exact original shape',
        'Generating prefix (Polish) notation from an expression tree',
      ],
    },
  },

  treeInorder: {
    tr: {
      howItWorks: [
        'Inorder gezintisinde önce sol alt ağaç, sonra kök, en son sağ alt ağaç ziyaret edilir.',
        'Bu sıralamanın özel bir gücü var: eğer ağaç bir İkili Arama Ağacı (BST) ise, inorder gezinti değerleri küçükten büyüğe tam sıralı şekilde verir — çünkü BST\'de her düğümün solundaki her şey ondan küçük, sağındaki her şey ondan büyüktür.',
      ],
      useCases: [
        'Bir İkili Arama Ağacındaki tüm değerleri sıralı halde almak (ekstra sıralama algoritması gerekmeden)',
        'Bir ağacın gerçekten geçerli bir BST olup olmadığını doğrulamak (inorder çıktısı sıralı mı diye bakılır)',
        'İfade ağaçlarında sembolleri okunabilir (infix) sırayla yazdırmak, örn. "(a + b)"',
      ],
    },
    en: {
      howItWorks: [
        'In Inorder traversal, the left subtree is visited first, then the root, and finally the right subtree.',
        'This order has a special power: if the tree is a Binary Search Tree, an inorder traversal produces every value in perfectly ascending sorted order — because in a BST, everything to a node\'s left is smaller and everything to its right is larger.',
      ],
      useCases: [
        'Retrieving all values from a Binary Search Tree already sorted, without running a separate sort',
        'Validating whether a tree is a genuinely correct BST (checking that inorder output is sorted)',
        'Printing expression trees in readable infix order, e.g. "(a + b)"',
      ],
    },
  },

  treePostorder: {
    tr: {
      howItWorks: [
        'Postorder gezintisinde önce sol alt ağaç, sonra sağ alt ağaç, en son kök ziyaret edilir — yani bir düğüm, kendi tüm alt ağaçları tamamen işlendikten sonra ziyaret edilir.',
        'Bu "önce çocuklar, sonra ebeveyn" mantığı, bir düğüme ait işlemin çocuklarının sonucuna bağlı olduğu her senaryo için idealdir.',
      ],
      useCases: [
        'Bir ağaç yapısını güvenle bellekten silmek/serbest bırakmak — önce çocuklar silinmeli, sonra ebeveyn',
        'Bir klasörün toplam boyutunu hesaplamak — önce alt klasörlerin boyutu bilinmeli, sonra üst klasörün toplamı çıkarılabilir',
        'İfade ağaçlarında postfix (RPN) notasyonu üretmek ve hesap makinelerinde bu notasyonu değerlendirmek',
      ],
    },
    en: {
      howItWorks: [
        'In Postorder traversal, the left subtree is visited first, then the right subtree, and the root is visited last — a node is only visited after both of its subtrees have been fully processed.',
        'This "children before parent" order is exactly what\'s needed whenever processing a node depends on the results from its children first.',
      ],
      useCases: [
        'Safely deleting/freeing a tree from memory — children must be freed before their parent, never the other way around',
        'Computing a folder\'s total size — every subfolder\'s size is needed before the parent folder\'s total can be summed',
        'Generating postfix (RPN) notation from expression trees, and evaluating that notation in calculators',
      ],
    },
  },

  treeLevelorder: {
    tr: {
      howItWorks: [
        'Level-Order gezintisi, ağacı yukarıdan aşağıya seviye seviye ziyaret eder: önce kök (seviye 0), sonra tüm seviye 1 düğümleri, sonra tüm seviye 2 düğümleri, ve böyle devam eder.',
        'Bu, aslında bir ağaç üzerinde çalıştırılan BFS\'tir — bir kuyruk kullanılarak, aynı seviyedeki düğümler soldan sağa işlenir.',
      ],
      useCases: [
        'Bir ağacı ekranda seviye seviye (bir organizasyon şeması gibi) yazdırmak',
        'Dengeli bir ağaçtan yeniden inşa edilebilecek şekilde serileştirme',
        'Bir ağaçta en yakın (en az adımla ulaşılan) düğümü veya en sığ çözümü bulmak — örn. bir oyun ağacında en hızlı kazanma yolunu aramak',
      ],
    },
    en: {
      howItWorks: [
        'Level-Order traversal visits a tree top to bottom, level by level: first the root (level 0), then all level-1 nodes, then all level-2 nodes, and so on.',
        'This is essentially BFS running on a tree — a queue is used so that nodes on the same level are processed left to right.',
      ],
      useCases: [
        'Printing a tree level by level on screen, like an organization chart',
        'Serializing a tree in a way that\'s easy to reconstruct level by level',
        'Finding the nearest node (reachable in the fewest steps) or the shallowest solution in a tree — e.g. searching for the fastest winning path in a game tree',
      ],
    },
  },
};

export function getExplanation(id, lang = 'tr') {
  const entry = EXPLANATIONS[id];
  if (!entry) return { howItWorks: [], useCases: [] };
  return entry[lang] || entry.tr;
}
