/* eslint-disable @stylistic/max-len */
import { IDefineTreatment } from './types.model';

const supportedTreatments = {
    face: [{
        title: $localize`:@@treatments.face.hygiene:Klasičan higijenski tretman`,
        description: $localize`:@@treatments.face.hygiene.description:Klasičan higijenski tretman podrazumeva uklanjanje mitisera, akni, milija komedoekspresijom. Procedura obuhvata pripremu kože, blagi piling, komedoekspresiju i završnu masku.`
    },
    {
        title: $localize`:@@treatments.face.premium-hygiene:Premium higijenski tretman`,
        description: $localize`:@@treatments.face.premium-hygiene.description:Premium higijenski tretman podrazumeva uklanjanje mitisera, akni i milija komedoekspresijom. Procedura obuhvata pripremu kože, blagi piling, komedoekspresiju, hemijski piling i završnu masku. Hemijski piling je nežan; uklanja prvi izumrli sloj ćelija kože rastapajući ih, čisti pore i sužava ih, smiruje upale i ujednačava ten. Nakon hemijskog pilinga nema crvenila i ljuštenja kože!`
    },
    {
        title: $localize`:@@treatments.face.non-invasive-mesotherapy:Neinvazivna mezoterapija`,
        description: $localize`:@@treatments.face.non-invasive-mesotherapy.description:Neinvazivna mezoterapija je postupak ubacivanja vitamina, minerala i drugih hranljivih sastojaka iz koktela u dublje slojeve kože. Prilikom ove procedure koristi se aparat koji emituje blage strujne impulse koji privremeno otvaraju mezo kanale u koži putem kojih sastojci iz koktela prodiru u dublje slojeve kože. Nakon tretmana nema perioda oporavka, tretman je bezbolan i nema crvenila. Pogodan je za sve tipove kože, a posebno za dehidriranu, suvu kožu i rozaceu, odnosno kuperozu.`
    },
    {
        title: $localize`:@@treatments.face.prx-t33:PRX T33 piling`,
        description: $localize`:@@treatments.face.prx-t33.description:PRX T33 piling je hemijski piling za biorevitalizaciju kože. Preporučuje se za sve tipove kože, a može se raditi tokom cele godine. Osvežava kožu, vraća joj jedrinu i blistavost, sužava pore, posvetljuje hiperpigmentacije, redukuje bore...Nakon tretmana nema perioda oporavka. Tretman traje kratko pa se može uraditi i na pauzi za ručak. Bezbolan je, nema crvenila ni ljuštenja kože.`
    },
    {
        title: $localize`:@@treatments.face.skeyndor:Skejndor hemijski piling`,
        description: $localize`:@@treatments.face.skeyndor.description:Skejndor hemijski piling je inovativni pristup nezi kože koji podrazumeva eksfolijaciju kože ali i obnovu mikrobioma kože. Svojom naprednom <em>probiome peel</em> tehnologijom, Skejndor pilinzi nežno uklanjaju izumrli sloj kože, ali i hrane kožu postbioticima i prebioticima kako bi uravnotežili mikrobiom kože. Koža je obnovljena, čista i blistava. Tretman je pogodan za sve tipove kože uključujući i tanku, osetljivu kožu kao i kuperoznu kožu. U sklopu tretmana dobija se i kućna nega u trajanju od sedam dana kako se produžio efekat tretmana.`
    },
    {
        title: $localize`:@@treatments.face.purple-peel:Purple peel 4`,
        description: $localize`:@@treatments.face.purple-peel.description:Purple peel 4 je inovativni hemijski piling koji uspešno redukuje akne, ožiljke od akni, duboke bore i hiperpigmentacije. Njegova svojstva podstiču obnavljanje i podmlađivanje kože. Spada u kategoriju dubokih pilinga koji stimulišu fibroplaste, a samim tim i proizvodnju kolagena i elastičnih vlakana. Nakon tretmana nema perioda oporavka. U zavisnosti od stanja kože može se javiti praškasto perutanje kože, ali ne i ljuštenje kože. Najbolji efekat ima u kombinaciji sa drugim tretmanima.`
    },
    {
        title: $localize`:@@treatments.face.t50-t35:T50T35 hemijski piling`,
        description: $localize`:@@treatments.face.t50-t35.description:T50T35 hemijski piling ima nekoliko važnih funkcija za zdrav izgled kože kao što su: revitalizacija, popravljanje teksture kože, ublažavanje hiperpigmentacija, rešavanje problema akni, popravljanje tonusa kože, ublažavanje bora i dr. Već nakon prvog tretmana primećuju se rezultati. Tretman biorevitalizacije može se raditi cele godine, čak i leti. Tretman ne zahteva period oporavka i idealan je u kombinaciji sa drugim tretmanima.`
    },
    {
        title: $localize`:@@treatments.face.dermapen:Dermapen`,
        description: $localize`:@@treatments.face.dermapen.description:Dermapen je tretman koji vašoj koži obezbeđuje sve neophodne vitamine i minerale. Izvodi se dermapen aparatom koji pravi veliki broj sitnih uboda na različitim dubinama koje omogućavaju bolju penetraciju aktivnih komponenti u dublje slojeve kože. Dermapen tretman je po efektima vodeća metoda za rešavanje najrazličitijih problematika kože. Veoma uspešno rešava problem aknozne kože, ožiljke od akni, bore, proširene pore, hiperpigmentacije, pad tonusa, vraća koži punoću jedrinu i osvežava lice. Radi se u seriji od četiri tretmana koji se izvode na svakih dvadeset dana. Tretman nije bolan - zahvaljujući anestetiku osećate samo sitno grebuckanje kože. Nakon tretmana postoji crvenilo i neophodan je oporavak kože u trajanju od 72h. U tom periodu se savetuje izbegavanje sauna, bazena, solarijuma, kao i naparavanje lica i boravak u prašini.`
    },
    {
        title: $localize`:@@treatments.face.hyaluron:Hijaluron tretman Skejndor`,
        description: $localize`:@@treatments.face.hyaluron.description:Hijaluron tretman Skejndor namenjen je koži koja ima nepravilne površinske bore, dehidriranoj i suvoj koži. Zahvaljujući svojim aktivnim sastojcima (visok udeo hijaluronske kiseline od 2%, liposomalna polarizovana voda, ekstrakt suncokreta, ksilitol i njegovi derivati), Vaša koža biće meka, nahranjena i oporavljena sa visokomolekularnom i niskomolekularnom hijaluronskom kiselinom.`
    },
    {
        title: $localize`:@@treatments.face.vitamin-c:Vitamin C tretman Skejndor`,
        description: $localize`:@@treatments.face.vitamin-c.description:Vitamin C tretman Skejndor sadrži 25% derivata vitamina C i 10% antioksidanata iz <em>acai</em> bobica. Ovo je tretman koji će Vašoj koži pružiti osveženje i blistavost uz opuštajuću masažu tokom celog tretmana. Namenjen je svim tipovima kože.`
    },
    {
        title: $localize`:@@treatments.face.ultrasonic:Ultrazvučno čišćenje kože`,
        description: $localize`:@@treatments.face.ultrasonic.description:Tretman čišćenja kože ultrazvučnom špatulom namenjen je koži bez vidljive problematike na licu (akne, duboki mitiseri). Špatula nežno čisti lice zahvaljujući ultrazvučnim talasima koje emituje te uklanja sebum, sitne mitisere i izumrle ćelije sa kože. Lako se kombinuje sa drugim tretmanima.`
    }],
    combination: [],
    browsLashes: []
} as Record<string, IDefineTreatment[]>;

export default supportedTreatments;
