Oskari.registerLocalization({
    lang : "fi",
    key : "PersonalData",
    value : {
        title : "Omat tiedot",
        desc : "Omat tiedot",
        notLoggedIn : "Rekisteröityneenä käyttäjänä löydät " + "Omista tiedoista tallentamasi karttanäkymät.",
        tabs : {
            myplaces : {
                title : "Kohteet",
                nocategories : "Et ole vielä tallentanut kohteita",
                "editCategory" : "Muokkaa tasoa",
                "grid" : {
                    "name" : "Nimi",
                    "desc" : "Kuvaus",
                    "createDate" : "Luotu",
                    "updateDate" : "Päivitetty",
                    "edit" : "Muokkaa",
                    "delete" : "Poista"
                },
                "notification" : {
                    "delete" : {
                        "title" : "Kohteen poistaminen",
                        "confirm" : "Haluatko poistaa kohteen ",
                        "success" : "Onnistui",
                        "error" :"Epäonnistui! Kokeile uudestaan myöhemmin",
                        "cancel" :"Kohdetta ei poistettu"
                    }
                }
            },
            myviews : {
                title : "Omat näkymät",
                edit : "Muokkaa",
                publish : "Julkiseksi",
                unpublish : "Yksityiseksi",
                "delete" : "Poista",
                
                
		        'popup' : {
		        	"title" : 'Näkymän tallennus',
		            'label' : 'Näkymän nimi:',
		            'placeholder' : 'Anna näkymälle nimi',
		            'save' : 'Tallenna',
		            'cancel' : 'Peruuta',
		            'error_noname' : 'Syötä nimi'
		        },
		        'save' : {
		            success : 'Näkymä tallennettu',
		            error : 'Tapahtui virhe - Näkymää ei tallennettu',
		            error_noname : 'Nimi ei voi olla tyhjä',
		            error_illegalchars : 'Nimessä on luvattomia merkkejä',
		            msg : {
		                view_name : 'Näkymän nimi'
		            },
		            button : {
		                save : 'Tallenna',
		                cancel : 'Peruuta'
		            }
		        }
		        
		        
            },
            publishedmaps : {
                title : "Julkaistut kartat"
            },
            account : {
                title : "Tilin tiedot",
                firstName : "Etunimi",
                lastName : "Sukunimi",
                nickName : "Nimimerkki",
                email : "Sähköpostiosoite",
                changeInfo : "Muuta tietoja",
                changePassword : "Muuta salasana",
                removeAccount : "Poista tili"
            }
        },
        edit : 'Muokkaa_näkymää',
        msg : {
            delete_view : "Poistetaanko näkymä",
            confirm_delete : "Poiston varmistus"
        },
        button : {
            yes : "Kyllä",
            no : "Ei"
        }
    }
});
