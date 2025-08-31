/* eslint-disable max-lines, @stylistic/max-len */
import { TreatmentDefinition } from '../treatment-definition';

const supportedFaceTreatments = [
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.hygiene.basic:Klasičan higijenski tretman (malo akni)`,
        name: 'Klasičan higijenski tretman (malo akni)',
        duration: 60,
        clone: true,
        price: 3500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.hygiene:Klasičan higijenski tretman`,
        price: 4500,
        rangedPrice: '3.500 - 5.500',
        name: 'Klasičan higijenski tretman',
        duration: 60,
        description: $localize`:@@treatments.face.hygiene.description:Klasičan higijenski tretman podrazumeva uklanjanje mitisera, akni i milija komedoekspresijom. Ova procedura se sastoji od pripreme kože, blagog pilinga, komedoekspresije i završne maske.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.hygiene.advanced:Klasičan higijenski tretman (puno akni)`,
        name: 'Klasičan higijenski tretman (puno akni)',
        duration: 60,
        clone: true,
        price: 5500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.premium-hygiene.basic:Premium higijenski tretman (malo akni)`,
        name: 'Premium higijenski tretman (malo akni)',
        duration: 90,
        clone: true,
        price: 4500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.premium-hygiene.regular:Premium higijenski tretman`,
        name: 'Premium higijenski tretman (osrednje akni)',
        duration: 90,
        price: 5500,
        rangedPrice: '4.500 - 6.500',
        description: $localize`:@@treatments.face.premium-hygiene.description:Premium higijenski tretman podrazumeva uklanjanje mitisera, akni i milija komedoekspresijom. Ova procedura se sastoji od pripreme kože, blagog pilinga, komedoekspresije, hemijskog pilinga i završne maske.<br><br>Hemijski piling je nežan; uklanja prvi izumrli sloj ćelija kože rastapajući ih. Ovaj piling čisti pore i sužava ih, smiruje upale i ujednačava ten. Nakon ove procedure nema crvenila i ljuštenja kože!`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.premium-hygiene.advanced:Premium higijenski tretman (puno akni)`,
        name: 'Premium higijenski tretman (puno akni)',
        duration: 90,
        clone: true,
        price: 6500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.non-invasive-mesotherapy:Neinvazivna mezoterapija`,
        name: 'Neinvazivna mezoterapija',
        duration: 60,
        price: 5000,
        description: $localize`:@@treatments.face.non-invasive-mesotherapy.description:Neinvazivna mezoterapija je postupak ubacivanja vitamina, minerala i drugih hranljivih sastojaka iz koktela u dublje slojeve kože.<br><br>Prilikom ove procedure koristi se aparat koji emituje blage strujne impulse koji privremeno otvaraju mezo kanale u koži putem kojih sastojci iz koktela prodiru u dublje slojeve kože.<br><br>Nakon tretmana nema perioda oporavka i generalno je bezbolan bez pridruženog crvenila. Pogodan je za sve tipove kože, a posebno za dehidriranu, suvu kožu i rozaceu, odnosno kuperozu.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.skeyndor:Skeyndor hemijski piling`,
        name: 'Skeyndor hemijski piling',
        duration: 60,
        price: 5000,
        description: $localize`:@@treatments.face.skeyndor.description:Skeyndor hemijski piling je inovativni pristup nezi kože koji uključuje eksfolijaciju kože ali i obnovu mikrobioma kože.<br><br>Svojom naprednom <em>probiome peel</em> tehnologijom, Skeyndor pilinzi nežno uklanjaju izumrli sloj kože, ali i hrane kožu postbioticima i prebioticima kako bi uravnotežili mikrobiom kože. Koža je obnovljena, čista i blistava.<br><br>Tretman je pogodan za sve tipove kože uključujući i tanku, osetljivu kožu kao i kuperoznu kožu. U sklopu tretmana dobija se i kućna nega u trajanju od sedam dana kako se produžio efekat tretmana.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.skeyndor:Skeyndor hemijski piling` + $localize`:@@treatments.package.default: - 4 tretmana`,
        name: 'Skeyndor hemijski piling - 4 tretmana',
        duration: 60,
        clone: true,
        price: 16000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.prx-t33:PRX T33 piling`,
        name: 'PRX T33 piling',
        duration: 60,
        price: 8000,
        description: $localize`:@@treatments.face.prx-t33.description:PRX T33 piling je hemijski piling za biorevitalizaciju kože. Preporučuje se za sve tipove kože, a može se raditi tokom cele godine. Osvežava kožu, vraća joj vitalnost i blistavost, istovremeno sužava pore, posvetljuje hiperpigmentacije i smanjuje bore.<br><br>Nakon tretmana nema perioda oporavka. Tretman traje kratko pa se može uraditi i na pauzi za ručak. Bezbolno je, nema crvenila ni ljuštenja kože.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.prx-t33:PRX T33 piling` + $localize`:@@treatments.package.default: - 4 tretmana`,
        name: 'PRX T33 piling - 4 tretmana',
        duration: 60,
        price: 24000,
        clone: true
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.purple-peel:Purple peel 4`,
        name: 'Purple peel 4',
        duration: 60,
        price: 7000,
        description: $localize`:@@treatments.face.purple-peel.description:Purple peel 4 je inovativni hemijski piling poznat po svojoj efikasnosti u smanjenju akni, ožiljaka od akni, dubokih bora i hiperpigmentacije.<br><br>Njegova jedinstvena svojstva podstiču obnavljanje i podmlađivanje kože. Spada u kategoriju dubokih pilinga koji stimulišu fibroplaste, a samim tim i proizvodnju kolagena i elastičnih vlakana.<br><br>Nakon tretmana nema perioda oporavka. U zavisnosti od stanja kože može se javiti praškasto perutanje kože, ali ne i ljuštenje kože. Za optimalne rezultate preporučuje se u kombinaciji sa drugim tretmanima.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.purple-peel:Purple peel 4` + $localize`:@@treatments.package.default: - 4 tretmana`,
        name: 'Purple peel 4 - 4 tretmana',
        duration: 60,
        price: 24000,
        clone: true
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.t50-t35:T50T35 hemijski piling`,
        name: 'T50T35 hemijski piling',
        duration: 60,
        price: 5000,
        description: $localize`:@@treatments.face.t50-t35.description:T50T35 hemijski piling nudi nekoliko bitnih prednosti za postizanje zdrave kože kao što su: revitalizacija, popravljanje teksture kože, ublažavanje hiperpigmentacija, rešavanje problema akni, popravljanje tonusa kože, ublažavanje bora i dr.<br><br>Već nakon prvog tretmana primećuju se vidljivi rezultati. Tretman biorevitalizacije može se raditi cele godine, čak i leti. Tretman ne zahteva period oporavka i idealan je u kombinaciji sa drugim tretmanima.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.t50-t35:T50T35 hemijski piling` + $localize`:@@treatments.package.default: - 4 tretmana`,
        name: 'T50T35 hemijski piling - 4 tretmana',
        duration: 60,
        price: 16000,
        clone: true
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.dermapen:Dermapen`,
        name: 'Dermapen',
        duration: 60,
        price: 8000,
        description: $localize`:@@treatments.face.dermapen.description:Dermapen je tretman koji vašoj koži obezbeđuje esencijalne vitamine i minerale. Izvodi se pomoću dermapen aparata koji stvara brojne male ubode na različitim dubinama, što omogućava bolji prodor aktivnih sastojaka u dublje slojeve kože.<br><br>Tretman Dermapenom je vodeći metod za rešavanje različitih problema kože zbog svoje efikasnosti. Efikasno se bavi problemima kao što su koža sklona aknama, ožiljci od akni, bore, proširene pore, hiperpigmentacija i gubitak tonusa kože, dok takođe vraća koži debljinu i podmlađuje ten. Radi se u seriji od četiri tretmana koji se izvode na svakih dvadeset dana.<br><br>Tretman nije bolan - zahvaljujući anestetiku osećate samo sitno grebuckanje kože. Nakon tretmana postoji crvenilo i neophodan je oporavak kože u trajanju od 72h. U tom periodu se savetuje izbegavanje sauna, bazena, solarijuma, kao i naparavanje lica i boravak u prašini.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.hyaluron:Hijaluron tretman Skeyndor`,
        name: 'Hijaluron tretman Skeyndor',
        duration: 60,
        price: 6000,
        description: $localize`:@@treatments.face.hyaluron.description:Hijaluron tretman Skeyndor namenjen je koži koja ima nepravilne površinske bore, kao i dehidriranoj, suvoj koži.<br><br>Zahvaljujući svojim aktivnim sastojcima (visok udeo hijaluronske kiseline od 2%, liposomalna polarizovana voda, ekstrakt suncokreta, ksilitol i njegovi derivati), Vaša koža biće meka, nahranjena i oporavljena sa visokomolekularnom i niskomolekularnom hijaluronskom kiselinom.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.aquatherm:Aquatherm tretman Skeyndor`,
        name: 'Aquatherm tretman Skeyndor',
        duration: 60,
        price: 6500,
        description: $localize`:@@treatments.face.aquatherm.description:Skeyndor Aquatherm je tretman oporavka kože, smiruje nadraženu kožu, hidrira je i hrani je. Pogodan je za sve tipove kože, a posebno za kožu sklonu crvenilu, iritacijama, ekcemima, dehidriranu kožu.<br>Sam tretman je opuštajući jer je prilikom celog tretmana prisutna masaža lica.<br><br>Glavni sastojci ovog tretmana su:<br>- Termalna morska voda<br>- Hijaluron<br>- Ceramidi<br>- Prebiotici<br>- Vitamin B12<br>- Prirodno vlažeći faktor<br>- Beta glukan<br>- Pantenol<br><br>Koža nakon tretmana je hidrirana, revitalizovana, smirena, meka i oporavljena.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.vitamin-c:Vitamin C tretman Skeyndor`,
        name: 'Vitamin C tretman Skeyndor',
        duration: 60,
        price: 6000,
        description: $localize`:@@treatments.face.vitamin-c.description:Vitamin C tretman Skeyndor se sastoji od 25% derivata vitamina C i 10% antioksidanata dobijenih iz <em>acai</em> bobica. Ovo je tretman koji će Vašoj koži pružiti osveženje i blistavost uz opuštajuću masažu tokom celog tretmana. Namenjen je svim tipovima kože.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.ultrasonic:Ultrazvučno čišćenje kože`,
        name: 'Ultrazvučno čišćenje kože',
        duration: 60,
        price: 3000,
        description: $localize`:@@treatments.face.ultrasonic.description:Tretman čišćenja kože ultrazvučnom špatulom namenjen je koži bez vidljivih problema na licu kao što su npr. akne ili duboki mitiseri.<br><br>Špatula nežno čisti lice zahvaljujući ultrazvučnim talasima koje emituje te uklanja sebum, sitne mitisere i izumrle ćelije kože. Lako se kombinuje sa drugim tretmanima.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.radio-lifting:Radiotalasni lifting`,
        name: 'Radiotalasni lifting',
        duration: 60,
        price: 4000,
        description: $localize`:@@treatments.face.radio-lifting.description:Radiotalasni lifting je veoma efikasan nehirurški tretman zatezanja opuštene kože i redukovanja bora. Metodom radiotalasa zagreva se srednji sloj kože u kojem se nalaze kolagen i elastin. Ova stimulacija podstiče kožu da pokrene proces obnavljanja elastičnih vlakana, a rezultat je jedrija, zategnutija i čvršća koža.<br><br>Tretman se može izvoditi i na licu i na telu. Uvek se sprovodi u serijama gde jednu seriju čine četiri tretmana koja se izvode na svakih pet do sedam dana.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.massage:Masaža lica i dekoltea`,
        name: 'Masaža lica i dekoltea',
        duration: 30,
        price: 2500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.vitamin:Vitaminski tretman`,
        name: 'Vitaminski tretman',
        duration: 60,
        price: 4000,
        description: $localize`:@@treatments.face.vitamin.description:Vitaminski tretman je biološka procedura nege kože koja ima za cilj da hrani kožu esencijalnim vitaminima. Preporučuje se za kožu kojoj je neophodno "buđenje", odnosno kožu koja je suva, dehidrirana koža koja pokazuje znake oksidativnog stresa.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.microdermabrasion:Mikrodermoabrazija`,
        name: 'Mikrodermoabrazija',
        duration: 60,
        price: 2500,
        description: $localize`:@@treatments.face.microdermabrasion.description:Mikrodermoabrazija je aparaturna metoda tretmana kojom se koža polira, odnosno kojom se skida orožali sloj kože.<br><br>Postupak koristi uređaj opremljen sondom koja pri svom vrhu ima glavu sa dijamantskim mikročesticama koje nežno ljušte površinu kože mehanički, uklanjajući mrtve ćelije. Istovremeno, funkcija vakuuma izvlači nečistoće sa lica, a ujedno stimuliše mikrocirkulaciju kože i podstiče limfnu drenažu.<br><br>Koža je meka, baršunasta i vidno svetlija sa glatkim, čistijim i blistavim izgledom. Najčešće se koristi u kombinaciji sa drugim tretmanima kako bi se poboljšali ukupni rezulati.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.hyaluron-pen:Hijaluron pen`,
        name: 'Hijaluron pen',
        duration: 60,
        price: 5000,
        description: $localize`:@@treatments.face.hyaluron-pen.description:Hijaluron pen je tretman za bezbolno popunjavanje bora ili povećanje usana hijaluronom. Za ovaj tretman ne koriste se nikakve igle i nema potrebnog perioda oporavka kože.<br><br>Inovacija iza hijaluron pena leži u njenoj sposobnosti da isporuči hijaluronsku kiselinu pod visokim pritiskom, stvarajući mikrokanale u koži kroz koje hijaluron prodire.`
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.oxygen:Tretman čistim kiseonikom`,
        name: 'Tretman čistim kiseonikom',
        duration: 60,
        price: 3000
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.eye-contour:Eye contour`,
        name: 'Eye contour',
        duration: 60,
        price: 6500
    }),
    new TreatmentDefinition({
        title: $localize`:@@treatments.face.aha-bha:Hemijski piling (AHA/BHA kiseline)`,
        name: 'Hemijski piling (AHA/BHA kiseline)',
        duration: 30,
        price: 3000
    })
];

export default supportedFaceTreatments;
