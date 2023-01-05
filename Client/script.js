/* Form-element ligger direkt på document-objektet och är globalt. Det betyder att man kan komma åt det utan att hämta upp det via exempelvis document.getElementById. 
Andra element, såsom t.ex. ett div-element behöver hämtas ur HTML-dokumentet för att kunna hämtas i JavaScript. 
Man skulle behöva skriva const todoList = document.getElemenetById("todoList"), för att hämta det elementet och sedan komma åt det via variabeln todoList. För formulär behöver man inte det steget, utan kan direkt använda todoForm (det id- och name-attribut som vi gav form-elementet), utan att man först skapar variabeln och hämtar form-elementet.
*/

/* På samma sätt kommer man åt alla fält i todoForm via dess name eller id-attribut. Så här kan vi använda title för att nå input-fältet title, som i HTML ser ut såhär: 
<input type="text" id="title" name="title" class="w-full rounded-md border-yellow-500 border-2 focus-within:outline-none focus:border-yellow-600 px-4 py-2" /> 
Nedan används därför todoForm.[fältnamn] för att sätta eventlyssnare på respektive fält i formuläret.*/

/* Eventen som ska fångas upp är 
1. När någon ställt muspekaren i inputfältet och trycker på en tangent 
2. När någon lämnar fältet, dvs. klickar utanför det eller markerar nästa fält. 
För att fånga tangenttryck kan man exempelvis använda eventtypen "keyup" och för att fånga eventet att någon lämnar fältet använder man eventtypen "blur" */

/* Till alla dessa fält och alla dessa typer av event koppplas en och samma eventlyssnare; validateField. Eventlyssnaren är funktionen validateField och den vill ta emot själva fältet som berörs. Eftersom man inte får sätta parenteser efter en eventlyssnare när man skickar in den, får man baka in den i en anonym arrow-function. Man får alltså inte skriva todoForm.title.addEventListener("keyup", validateField(event.target)), utan man måste använda en omslutande funktion för att skicka event.target som argument. Därför används en anonym arrowfunction med bara en rad - att anropa validateField med det argument som den funktionen vill ha.  */

/*receptForm namnet på formuläret som kommer från index.  */
receptForm.title.addEventListener('keyup', (event) => validateField(event.target));
receptForm.title.addEventListener('blur', (event) => validateField(event.target));
/* En annan eventtyp som kan användas för att fånga tangenttryck är "input". De fungerar lite olika, men tillräckligt lika för vårt syfte. Kolla gärna själva upp skillnader.  */
receptForm.allergy.addEventListener('input', (event) => validateField(event.target));
receptForm.allergy.addEventListener('blur', (event) => validateField(event.target));

/* I dueDate måste man fånga upp input, då man kan förändra fältet genom att välja datum i en datumväljare, och således aldrig faktiskt skriva i fältet.  */
// receptForm.dueDate.addEventListener('input', (event) => validateField(event.target));
// receptForm.dueDate.addEventListener('blur', (event) => validateField(event.target));

/* Formuläret har eventtypen"submit", som triggas när någon trycker på en knapp av typen "submit". Som denna: 
<button name="submitTodoForm" class="rounded-md bg-yellow-500 hover:bg-yellow-400 px-4 py-1" type="submit"> */

/* Så istället för att lyssna efter "click"-event hos knappen, lyssnar man istället efter formulärets "submit"-event som kan triggas av just denna knapp just för att den har typen submit. */
receptForm.addEventListener('submit', onSubmit);

/* Här hämtas list-elementet upp ur HTML-koden. Alltså det element som vi ska skriva ut listelement innehållande varje enskild uppgift i. */
const todoListElement = document.getElementById('receptList');
/* Jag använder oftast getElementById, men andra sätt är att t.ex. använda querySelector och skicka in en css-selektor. I detta fall skulle man kunna skriva document.querySelector("#todoList"), eftersom # i css hittar specifika id:n. Ett annat sätt vore att använda elementet document.querySelector("ul"), men det är lite osäkert då det kan finnas flera ul-element på sidan. Det går också bra att hämta på klassnamn document.querySelector(".todoList") om det hade funnits ett element med sådan klass (det gör det inte). Klasser är inte unika så samma kan finnas hos flera olika element och om man vill hämta just flera element är det vanligt att söka efter dem via ett klassnamn. Det man behöver veta då är att querySelector endast kommer att innehålla ett enda element, även om det finns flera. Om man vill hitta flera element med en viss klass bör man istället använda querySelectorAll.  */

/* Här anges startvärde för tre stycken variabler som ska användas vid validering av formulär. P.g.a. lite problem som bl.a. har med liveServer att göra, men också att formuläret inte rensas har dessa satts till true från början, även om det inte blir helt rätt. Dessa ska i alla fall tala om för applikationen om de olika fälten i formulären har fått godkänd input.  */
let titleValid = true;
let allergyValid = true;


/* Här skapas en instans av api-klassen som finns i filen Api.js. 
Där skrevs en konstruktor, som skulle ta emot en url. 
constructor(url) {...} 
Denna url skickas in till Api-klassen genom att man anger new, klassens namn (Api), parenteser. Inom parenteserna skickas sedan det som konstruktorn vill ta emot - dvs. url:en till vårt api. 
Adressen som skickas in är http://localhost:5000/allRecept och innan det fungerar är det viktigt att ändra det i servern. I Lektion 5 sattes alla routes till /oneRecept. Dessa ska ändras till /allRecept. Dessa routes är första argumenten till app.get, app.post och app.delete, så det ser ut ungefär app.get("/oneRecept",...). Alla sådana ska ändras till "/allRecept". */
const api = new Api('http://localhost:5000/allRecept');

/* Nedan följer callbackfunktionen som är kopplad till alla formulärets fält, när någon skriver i det eller lämnar det.
Funktionen tar emot en parameter - field - som den får genom att eventtarget skickas till funktionen när den kopplas med addEventListener ovan. */
function validateField(field) {
  /* Destructuring används för att plocka ut endast egenskaperna name och value ur en rad andra egenskaper som field har. Mer om destructuring https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment */

  /* Name är det name-attribut som finns på HTML-taggen. title i detta exempel: <input type="text" id="title" name="title" /> 
  value är innehållet i fältet, dvs. det någon skrivit. */
  const { name, value } = field;

  /* Sätter en variabel som framöver ska hålla ett valideringsmeddelande */
  let = validationMessage = '';
  /* En switchsats används för att kolla name, som kommer att vara title om någon skrivit i eller lämnat titlefältet, annars allergy eller date.   */
  switch (name) {
    /* Så de olika fallen - case - beror på vilket name-attribut som finns på det elementet som skickades till validateField - alltså vilket fält som någon skrev i eller lämnade. */

    /* Fallet om någon skrev i eller lämnade fältet med name "title" */
    case 'title': {
      /* Då görs en enkel validering på om värdet i title-fältet är kortare än 2 */
      if (value.length < 3) {
        /* Om det inte är tre tecken långt kommer man in i denna if-sats och titleValid variabeln sätts till false, validationMessage sätts till ett lämpligt meddelande som förklarar vad som är fel.  */
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 3 tecken.";
      } else if (value.length > 60) {
        /* Validering görs också för att kontrollera att texten i fältet inte har fler än 60 tecken. */
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 60 tecken.";
      } else {
        /* Om ingen av dessa if-satser körs betyder det att fältet är korrekt ifyllt. */
        titleValid = true;
      }
      break;
    }
    /* Fallet om någon skrev i eller lämnade fältet med name "allergy" */
    case 'allergy': {
      /* Liknande enkla validering som hos title */
      if (value.length > 100) {
        allergyValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 100 tecken.";
      } else {
        allergyValid = true;
      }
      break;
    } 
  }
  /* När alla fall sökts igenom sätts här attribut på fältets förra syskon-element, previousElementSibling. 
  Det fungerar så att alla element som ligger inom samma element är syskon. I index.html omsluts alla <input>-element av ett <section>-element. I samma <section>-element finns ett <label>-element och ett <p>-element  <p>-elementen ligger innan <input>-elementen, så alla <p>-element är föregående syskon till alla <input>-element - previousSiblingElement. 
  
  så field.previousElementSibling hittar det <p>-element som ligger innan det inputfält som någon just nu har skrivit i eller lämnat. 
  */

  /* <p>-elementets innerText (textinnehåll) sätts till den sträng som validationMessage innehåller - information om att titeln är för kort, exempelvis.  */
  field.previousElementSibling.innerText = validationMessage;
  /* Tailwind har en klass som heter "hidden". Om valideringsmeddelandet ska synas vill vi förstås inte att <p>-elementet ska vara hidden, så den klassen tas bort. */
  field.previousElementSibling.classList.remove('hidden');
}

/* Callbackfunktion som används för eventlyssnare när någon klickar på knappen av typen submit */
function onSubmit(event) {
  /* Standardbeteendet hos ett formulär är att göra så att webbsidan laddas om när submit-eventet triggas. I denna applikation vill vi fortsätta att köra JavaScript-kod för att behandla formulärets innehåll och om webbsidan skulle ladda om i detta skede skulle det inte gå.   */

  /* Då kan man använda eventets metod preventDefault för att förhindra eventets standardbeteende, där submit-eventets standardbeteende är att ladda om webbsidan.  */
  console.log('det funkar att spara');
  event.preventDefault(); //något fel här. Tar vi bort event.preventDefault(); fungerar nästkommande console.log('sparas'); och  console.log('Submit');. Vad kan vara fel??
  /* Ytterligare en koll görs om alla fält är godkända, ifall man varken skrivit i eller lämnat något fält. */
  console.log('sparas');
  if (titleValid && allergyValid) {
    /* Log för att se om man kommit förbi valideringen */
    console.log('Submit');

    /* Anrop till funktion som har hand om att skicka uppgift till api:et */
    saveOneRecept();
  }
}

/* Funktion för att ta hand om formulärets data och skicka det till api-klassen. */
function saveOneRecept() {
  /* Ett objekt vid namn oneRecept byggs ihop med hjälp av formulärets innehåll */
  /* Eftersom vi kan komma åt fältet via dess namn - todoForm - och alla formulärets fält med dess namn - t.ex. title - kan vi använda detta för att sätta värden hos ett objekt. Alla input-fält har sitt innehåll lagrat i en egenskap vid namn value (som också används i validateField-funktionen, men där har egenskapen value "destrukturerats" till en egen variabel. ) */
  const oneRecept = {
    title: receptForm.title.value,
    allergy: receptForm.allergy.value
  };
  /* Ett objekt finns nu som har egenskaper motsvarande hur vi vill att uppgiften ska sparas ner på servern, med tillhörande värden från formulärets fält. */

  /* Api-objektet, d.v.s. det vi instansierade utifrån vår egen klass genom att skriva const api = new Api("http://localhost:5000/allRecept); en bit upp i koden.*/

  /* Vår Api-klass har en create-metod. Vi skapade alltså en metod som kallas create i Api.js som ansvarar för att skicka POST-förfrågningar till vårt eget backend. Denna kommer vi nu åt genom att anropa den hos api-objektet.  */

  /* Create är asynkron och returnerar därför ett promise. När hela serverkommunikationen och create-metoden själv har körts färdigt, kommer then() att anropa. Till then skickas den funktion som ska hantera det som kommer tillbaka från backend via vår egen api-klass.  
  
  Callbackfunktionen som används i then() är en anonym arrow-function som tar emot innehållet i det promise som create returnerar och lagrar det i variabeln oneRecept. 
  */

  api.create(oneRecept).then((oneRecept) => {
    /* oneRecept kommer här vara innehållet i promiset. Om vi ska följa objektet hela vägen kommer vi behöva gå hela vägen till servern. Det är nämligen det som skickas med res.send i server/api.js, som api-klassens create-metod tar emot med then, översätter till JSON, översätter igen till ett JavaScript-objekt, och till sist returnerar som ett promise. Nu har äntligen det promiset fångats upp och dess innehåll - uppgiften från backend - finns tillgängligt och har fått namnet "oneRecept".  */
    if (oneRecept) {
      /* När en kontroll har gjorts om oneRecept ens finns - dvs. att det som kom tillbaka från servern faktiskt var ett objekt kan vi anropa renderList(), som ansvarar för att uppdatera vår todo-lista. renderList kommer alltså att köras först när vi vet att det gått bra att spara ner den nya uppgiften.  */
      renderList();
    }
  });
}

/* En funktion som ansvarar för att skriva ut todo-listan i ett ul-element. */
function renderList() {
  /* Logg som visar att vi hamnat i render-funktionen */
  console.log('rendering');

  /* Anrop till getAll hos vårt api-objekt. Metoden skapades i Api.js och har hand om READ-förfrågningar mot vårt backend. */
  api.getAll().then((allRecept) => {
    /* När vi fått svaret från den asynkrona funktionen getAll, körs denna anonyma arrow-funktion som skickats till then() */

    /* Här används todoListElement, en variabel som skapades högt upp i denna fil med koden const todoListElement = document.getElementById('todoList');
     */

    /* Först sätts dess HTML-innehåll till en tom sträng. Det betyder att alla befintliga element och all befintlig text inuti todoListElement tas bort. Det kan nämligen finnas list-element däri när denna kod körs, men de tas här bort för att hela listan ska uppdateras i sin helhet. */
    todoListElement.innerHTML = '';
    todoListElement.insertAdjacentHTML('beforeend', renderOneRecept
    (oneRecept));

    /* De hämtade uppgifterna från servern via api:et getAll-funktion får heta allRecept, eftersom callbackfunktionen som skickades till then() har en parameter som är döpt så. Det är allRecept-parametern som är innehållet i promiset. */



    // behöcvs denanstående kod?

    /* Koll om det finns någonting i allRecept och om det är en array med längd större än 0 */
    // if (allRecept && allRecept.length > 0) {
      /* Om allRecept är en lista som har längd större än 0 loopas den igenom med forEach. forEach tar, likt then, en callbackfunktion. Callbackfunktionen tar emot namnet på varje enskilt element i arrayen, som i detta fall är ett objekt innehållande en uppgift.  */
      //sortByDate(allRecept);
      //allRecept.forEach((oneRecept) => {
        /* Om vi bryter ned nedanstående rad får vi något i stil med:
        1. todoListElement: ul där alla uppgifter ska finnas
        2. insertAdjacentHTML: DOM-metod som gör att HTML kan läggas till inuti ett element på en given position
        3. "beforeend": positionen där man vill lägga HTML-koden, i detta fall i slutet av todoListElement, alltså längst ned i listan. 
        4. renderOneRecept(oneRecept) - funktion som returnerar HTML. 
        5. oneRecept (objekt som representerar en uppgift som finns i arrayen) skickas in till renderOneRecept, för att renderOneRecept ska kunna skapa HTML utifrån egenskaper hos uppgifts-objektet. 
        */

        /* Denna kod körs alltså en gång per element i arrayen allRecept, dvs. en  gång för varje uppgiftsobjekt i listan. */
        //todoListElement.insertAdjacentHTML('beforeend', renderOneRecept(oneRecept));
      //});
    //}
  });
}

/* render oneRecept är en funktion som returnerar HTML baserat på egenskaper i ett uppgiftsobjekt. 
Endast en uppgift åt gången kommer att skickas in här, eftersom den anropas inuti en forEach-loop, där uppgifterna loopas igenom i tur och ordning.  */

/* Destructuring används för att endast plocka ut vissa egenskaper hos uppgifts-objektet. Det hade kunnat stå function renderOneRecept(oneRecept) {...} här - för det är en hel oneRecept som skickas in - men då hade man behövt skriva oneRecept.id, oneRecept.title osv. på alla ställen där man ville använda dem. Ett trick är alltså att "bryta ut" dessa egenskaper direkt i funktionsdeklarationen istället. Så en hel oneRecept skickas in när funktionen anropas uppe i todoListElement.insertAdjacentHTML("beforeend", renderOneRecept(oneRecept)), men endast vissa egenskaper ur det oneRecept-objektet tas emot här i funktionsdeklarationen. */
function renderOneRecept({ id, title, allergy}) {
  /* Baserat på inskickade egenskaper hos oneRecept-objektet skapas HTML-kod med styling med hjälp av tailwind-klasser. Detta görs inuti en templatestring  (inom`` för att man ska kunna använda variabler inuti. Dessa skrivs inom ${}) */

  /*
  Det som skrivs inom `` är vanlig HTML, men det kan vara lite svårt att se att det är så. Om man enklare vill se hur denna kod fungerar kan man klistra in det i ett HTML-dokument, för då får man färgkodning och annat som kan underlätta. Om man gör det kommer dock ${...} inte innehålla texten i variabeln utan bara skrivas ut som det är. Men det är lättare att felsöka just HTML-koden på det sättet i alla fall. 
  */

  /* Lite kort om vad HTML-koden innehåller. Det mesta är bara struktur och Tailwind-styling enligt eget tycke och smak. Värd att nämna extra är dock knappen, <button>-elementet, en bit ned. Där finns ett onclick-attribut som kopplar en eventlyssnare till klickeventet. Eventlyssnaren här heter onDelete och den får med sig egenskapen id, som vi fått med oss från oneRecept-objektet. Notera här att det går bra att sätta parenteser och skicka in id på detta viset här, men man fick inte sätta parenteser på eventlyssnare när de kopplades med addEventListener (som för formulärfälten högre upp i koden). En stor del av föreläsning 3 rörande funktioner och event förklarar varför man inte får sätta parenteser på callbackfunktioner i JavaScriptkod. 
  
  När eventlyssnaren kopplas till knappen här nedanför, görs det däremot i HTML-kod och inte JavaScript. Man sätter ett HTML-attribut och refererar till eventlyssnarfunktionen istället. Då fungerar det annorlunda och parenteser är tillåtna. */
 

  let html = `
    <li class="select-none mt-2 py-2 border-b border-pink-300 ${oneReceptColor}">
      <div class="flex items-center">
      <h3 class="mb-3 flex-1 text-xl font-bold uppercase">${title}</h3>
        <div>
          <button onclick="deleteOneRecept(${id})" class="inline-block bg-violet-300 text-xs text-violet-700 border border-pink px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;

  /* Här har templatesträngen avslutats tillfälligt för att jag bara vill skriva ut kommande del av koden om allergy faktiskt finns */

  allergy &&
    /* Med hjälp av && kan jag välja att det som står på andra sidan && bara ska utföras om allergy faktiskt finns.  */

    /* Det som ska göras om dallergy finns är att html-variabeln ska byggas på med HTML-kod som visar det som finns i allergy-egenskapen hos oneRecept-objektet. */
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${allergy}</p>
  `);

  /* När html-strängen eventuellt har byggts på med HTML-kod för allergy-egenskapen läggs till sist en sträng motsvarande sluttaggen för <li>-elementet dit. */
  html += `
    </li>`;

  /* html-variabeln returneras ur funktionen och kommer att vara den som sätts som andra argument i todoListElement.insertAdjacentHTML("beforeend", renderOneRecept(oneRecept)) */
  return html;
}

/* Funktion för att ta bort uppgift. Denna funktion är kopplad som eventlyssnare i HTML-koden som genereras i renderOneRecept */
function deleteOneRecept(id) {
  /* Det id som skickas med till deleteOneRecept är taget från respektive uppgift. Eftersom renderOneRecept körs en gång för varje uppgift, och varje gång innehåller en unik egenskap och dess uppgifter, kommer också ett unikt id vara kopplat till respektive uppgift i HTML-listan. Det är det id:t som skickas in hit till deleteallRecept. */

  /* Api-klassen har en metod, remove, som sköter DELETE-anrop mot vårt egna backend */
  api.remove(id).then((result) => {
    /* När REMOVE-förfrågan är skickad till backend via vår Api-klass och ett svar från servern har kommit, kan vi på nytt anropa renderList för att uppdatera listan. Detta är alltså samma förfarande som när man skapat en ny uppgift - när servern är färdig uppdateras listan så att aktuell information visas. */

    renderList();
    /* Notera att parametern result används aldrig i denna funktion. Vi skickar inte tillbaka någon data från servern vid DELETE-förfrågningar, men denna funktion körs när hela anropet är färdigt så det är fortfarande ett bra ställe att rendera om listan, eftersom vi här i callbackfunktionen till then() vet att den asynkrona funktionen remove har körts färdigt. */
  });
}


renderList();