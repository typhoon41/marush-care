const supportedTreatments = {
    face: {
        face1: 'face1desc',
        face2: 'face1desc',
        face3: 'face1desc'
    },
    combination: {
        combo1: 'combo1desc',
        combo2: 'combo2desc'
    },
    browsLashes: {
        // eslint-disable-next-line @stylistic/max-len
        browsLashes1: 'Dermapen tretman sadrži dermapen uređaj u obliku olovke koji na svom vrhu ima mikroiglice sa mogucnosti prilagodjavanja dubine penetracije u kožu. Dužina iglica se podešava u zavisnosti od zone koja se tretira. Tokom ovog tretmana nastaju ciljane mikropovrede koje koža sama tera na isceljenje, što dovodi do proizvodnje fibroplasta i novog kolagena. Kanali koje smo stvorili mikroiglicama odličan su put za ubacivanje koktela vitamina pri čemu ostvarujemo vidne i trajne rezultate.'
    }
} as Record<string, Record<string, string>>;

export default supportedTreatments;
