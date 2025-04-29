<template>

  <div class="specs-grid">
    <!-- Conditionally render each spec item if its prop has a value -->
    <div v-if="operating_system" class="spec-item os" data-spec-type="os">
      <div class="spec-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21 13v7.434a1.5 1.5 0 0 1-1.553 1.499l-.133-.011L12 21.008V13zm-11 0v7.758l-5.248-.656A2 2 0 0 1 3 18.117V13zm9.314-10.922a1.5 1.5 0 0 1 1.68 1.355l.006.133V11h-9V2.992zM10 3.242V11H3V5.883a2 2 0 0 1 1.752-1.985z"/></g></svg>
        Operating System</div>
      <div class="spec-value">{{ operating_system }}</div>
    </div>

    <div v-if="processor" class="spec-item processor" data-spec-type="processor">
      <div class="spec-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24"><path fill="currentColor" d="M10.358 9.938c1.082-.12 2.202-.12 3.284 0a.464.464 0 0 1 .409.4c.129 1.104.129 2.22 0 3.324a.464.464 0 0 1-.41.4a15 15 0 0 1-3.283 0a.464.464 0 0 1-.409-.4a14.3 14.3 0 0 1 0-3.324a.464.464 0 0 1 .41-.4"/><path fill="currentColor" fill-rule="evenodd" d="M15 2.25a.75.75 0 0 1 .75.75v2.927a2.93 2.93 0 0 1 2.308 2.323H21a.75.75 0 0 1 0 1.5h-2.788q.055.75.073 1.5H20a.75.75 0 0 1 0 1.5h-1.715q-.018.75-.073 1.5H21a.75.75 0 0 1 0 1.5h-2.942a2.93 2.93 0 0 1-2.308 2.323V21a.75.75 0 0 1-1.5 0v-2.774q-.748.053-1.5.07V20a.75.75 0 0 1-1.5 0v-1.704a32 32 0 0 1-1.5-.07V21a.75.75 0 0 1-1.5 0v-2.927a2.93 2.93 0 0 1-2.308-2.323H3a.75.75 0 0 1 0-1.5h2.788q-.055-.75-.074-1.5H4a.75.75 0 0 1 0-1.5h1.714q.019-.75.074-1.5H3a.75.75 0 0 1 0-1.5h2.942A2.93 2.93 0 0 1 8.25 5.927V3a.75.75 0 0 1 1.5 0v2.774q.748-.053 1.5-.07V4a.75.75 0 0 1 1.5 0v1.704q.752.017 1.5.07V3a.75.75 0 0 1 .75-.75m-1.192 6.197a16.4 16.4 0 0 0-3.616 0c-.898.1-1.626.808-1.732 1.717a15.8 15.8 0 0 0 0 3.672c.106.91.834 1.616 1.732 1.717c1.192.133 2.424.133 3.616 0a1.96 1.96 0 0 0 1.732-1.717c.143-1.22.143-2.452 0-3.672a1.96 1.96 0 0 0-1.732-1.717" clip-rule="evenodd"/></svg>
        Processor</div>
      <div class="spec-value">{{ processor }}</div>
    </div>

    <div v-if="graphics_card" class="spec-item graphics" data-spec-type="graphics">
      <div class="spec-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256">
          <path fill="currentColor" d="M232 44H16A12 12 0 0 0 4 56v152a12 12 0 0 0 24 0v-12h16v12a12 12 0 0 0 24 0v-12h16v12a12 12 0 0 0 24 0v-12h16v12a12 12 0 0 0 24 0v-12h84a20 20 0 0 0 20-20V64a20 20 0 0 0-20-20m-4 128H28V68h200Zm-52-12a40 40 0 1 0-40-40a40 40 0 0 0 40 40m0-56a16 16 0 1 1-16 16a16 16 0 0 1 16-16m-96 56a40 40 0 1 0-40-40a40 40 0 0 0 40 40m0-56a16 16 0 1 1-16 16a16 16 0 0 1 16-16" />
        </svg>
        Graphics Card</div>
      <div class="spec-value">{{ graphics_card }}</div>
    </div>

    <div v-if="ram" class="spec-item ram" data-spec-type="ram">
       <div class="spec-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24"><path fill="currentColor" d="M2 5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1v2a1 1 0 0 0 1 1h7.414l1-1h1.172l1 1H21a1 1 0 0 0 1-1v-2a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm18 11v1h-5.586l-1-1zm-9.414 0l-1 1H4v-1zM3 14V7h18v7zm2-5h2v3H5zm6 0H9v3h2zm2 0h2v3h-2zm6 0h-2v3h2z"/></svg>
        RAM</div>
       <div class="spec-value">{{ ram }}</div>
    </div>

    <div v-if="storage" class="spec-item storage" data-spec-type="storage">
      <div class="spec-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
            <path fill="currentColor" d="M19 4a2 2 0 0 1 1.995 1.85L21 6v4a2 2 0 0 1-1.85 1.995L19 12H5a2 2 0 0 1-1.995-1.85L3 10V6a2 2 0 0 1 1.85-1.995L5 4zm0 2H5v4h14zm-9 1a1 1 0 0 1 .117 1.993L10 9H8a1 1 0 0 1-.117-1.993L8 7zm9 6a2 2 0 0 1 1.995 1.85L21 15v4a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19v-4a2 2 0 0 1 1.85-1.995L5 13zm0 2H5v4h14zm-9 1a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2z" />
          </g>
      </svg>
        Storage :

      </div>
      <div class="spec-value">{{ storage }}</div>
    </div>


    <div v-if="motherboard" class="spec-item motherboard" data-spec-type="motherboard">
      <div class="spec-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 16 16"><g fill="currentColor"><path d="M11.5 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m2 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m-10 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zM5 3a1 1 0 0 0-1 1h-.5a.5.5 0 0 0 0 1H4v1h-.5a.5.5 0 0 0 0 1H4a1 1 0 0 0 1 1v.5a.5.5 0 0 0 1 0V8h1v.5a.5.5 0 0 0 1 0V8a1 1 0 0 0 1-1h.5a.5.5 0 0 0 0-1H9V5h.5a.5.5 0 0 0 0-1H9a1 1 0 0 0-1-1v-.5a.5.5 0 0 0-1 0V3H6v-.5a.5.5 0 0 0-1 0zm0 1h3v3H5zm6.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/><path d="M1 2a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 9H1V8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6H1V5H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 2zm1 11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z"/></g></svg>
        Motherboard</div>
      <div class="spec-value">{{ motherboard }}</div>
    </div>
  </div>
  <div
  v-if="description"
    class="more-info"
    >
    <p class="header"> Plus d'informations :</p>
    <p class="description"> 
      {{ description }}
    </p>
   

    </div>

</template>

<script setup>
// Keep the original props definition
const props = defineProps({
  product:{type:Object,required:true}
});

const {operating_system,storage ,processor,graphics_card,ram,motherboard ,description} = props.product
console.log(operating_system);
</script>

<style lang="less" scoped>
.specs-grid {
  --text-color: white;

  /* Define base font size - will be overridden by nth-child */
  --base-font-size: 1rem; /* Default/smallest size */

  /* --- Define Color Variables --- */
  /* It's useful to define them here so they are available */
  --os-header-bg: #607D8B;
  --os-value-bg: #90A4AE;

  --processor-header-bg: #3F51B5;
  --processor-value-bg: #9FA8DA;

  --graphics-header-bg: #4CAF50;
  --graphics-value-bg: #66BB6A;

  --ram-header-bg: #D84315;
  --ram-value-bg: #FF7043;

  --storage-header-bg: #1976D2;
  --storage-value-bg: #42A5F5;

  --motherboard-header-bg: #616161;
  --motherboard-value-bg: #9E9E9E;

  /* Default/fallback background variables if needed */
  --spec-header-bg: grey;
  --spec-value-bg: lightgrey;
}

/* mobile 320px */
@media only screen and (min-width: 0px) {
.specs-grid{
  --base-font-size: 1.2rem; 
  padding-top: 8px;
  margin-bottom: 12px;

  display: grid;
  /* Keep the grid structure */

    grid-template-rows: repeat(6, 1fr); 
    gap:4px;


  min-height: 400px; /* Or adjust as needed */
  font-family: "Roboto", sans-serif;
  font-size:var(--base-font-size);
  /* font-size:2em; */
}

.spec-item {
  position:relative;
  color: var(--text-color);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  /* Apply font size using a variable - defaults to base, overridden by nth-child */
  font-size: var(--spec-font-size);


  overflow:hidden;
  isolation:isolate;

}

.spec-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.spec-header {
  position:relative;
  isolation:isolate;
  padding: 0.8rem;
  font-weight: 600;
  color: var(--text-color);
  display:flex;
  align-items:center;
  // justify-content:space-between;
  gap:4px;


  /* Use the spec-specific background variable */
  background-color: var(--spec-header-bg);
  min-height: 40px;



}

.spec-value {
  position:relative;

  flex: 1;
  padding: 0.8rem;


  color: var(--text-color);
  font-weight: 900;
  /* Use the spec-specific background variable */
  background-color: var(--spec-value-bg);

  font-size:.9em;
  text-transform:capitalize;
}

.spec-header , .spec-value {
  position:relative;
  isolation:isolate;
}
/* --- Assign Color Variables based on Spec Type --- */
/* Use data attribute or original class to set the correct color variables for the item */
.spec-item[data-spec-type="os"], .spec-item.os {
  --spec-header-bg: var(--os-header-bg);
  --spec-value-bg: var(--os-value-bg);
}
.spec-item[data-spec-type="processor"], .spec-item.processor {
  --spec-header-bg: var(--processor-header-bg);
  --spec-value-bg: var(--processor-value-bg);
}
.spec-item[data-spec-type="graphics"], .spec-item.graphics {
  --spec-header-bg: var(--graphics-header-bg);
  --spec-value-bg: var(--graphics-value-bg);
}
.spec-item[data-spec-type="ram"], .spec-item.ram {
  --spec-header-bg: var(--ram-header-bg);
  --spec-value-bg: var(--ram-value-bg);
}
.spec-item[data-spec-type="storage"], .spec-item.storage {
  --spec-header-bg: var(--storage-header-bg);
  --spec-value-bg: var(--storage-value-bg);
}
.spec-item[data-spec-type="motherboard"], .spec-item.motherboard {
  --spec-header-bg: var(--motherboard-header-bg);
  --spec-value-bg: var(--motherboard-value-bg);
}


.more-info{
  .header{
    font-size:1.4em;
    font-weight:bolder;
  }
  .description {
    white-space: pre-line;
    padding: 8px 4px;
    overflow-y: auto;
  }
}


}

/* Tablet - 768px */
@media only screen and (min-width: 768px) {
  .specs-grid {
    --base-font-size: 1.2rem; 
  } 


  .specs-grid{
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr); 
  }

  .spec-value {
    font-size:0.8em;
  }
/* --- 1st VISIBLE Child --- */
.spec-item:nth-child(1) {
  grid-area: 1 / 1 / span 2 / span 8; /* Row Start / Col Start / Row Span / Col Span */
  --spec-font-size: 1.2em; /* Largest font */
}

/* --- 2nd VISIBLE Child --- */
.spec-item:nth-child(2) {
  grid-area: 3 /1 / span 2 / span 4;
  --spec-font-size: 1.2em;
}

/* --- 3rd VISIBLE Child --- */
.spec-item:nth-child(3) {
  grid-area: 3 / 5 / span 3 / span 4;
  --spec-font-size: 1.1em;
}


/* --- 4th VISIBLE Child --- */
.spec-item:nth-child(4) {
   /* Original RAM position - Adjusted slightly */
   grid-area: 5 / 1 / span 2 / span 4;
  --spec-font-size: 1.1em;
}

/* --- 5th VISIBLE Child --- */
.spec-item:nth-child(5) {
  /* Original Storage position */
  grid-area: 7 / 1 / span 2 / span 4;
  --spec-font-size: 1.1em;
}

/* --- 6th VISIBLE Child --- */
.spec-item:nth-child(6) {
   /* Original Motherboard position */
   grid-area: 6 / 5 / span 3 / span 4; /* Adjusted slightly to fit grid */
  --spec-font-size: 1.1em; /* Smallest font */
}

}

// dark mode
body.dark-mode {
  .specs-grid { // Target variables within the component scope
      --text-color: #e1e1e1; // Lighter text

      // Adjust background colors by darkening or choosing specific dark variants
      --os-header-bg: #455A64;
      --os-value-bg: #546E7A;

      --processor-header-bg: #283593;
      --processor-value-bg: #3949AB;

      --graphics-header-bg: #388E3C;
      --graphics-value-bg: #43A047;

      --ram-header-bg: #C62828; // Darker red/orange
      --ram-value-bg: #E53935;

      --storage-header-bg: #1565C0;
      --storage-value-bg: #1E88E5;

      --motherboard-header-bg: #424242;
      --motherboard-value-bg: #616161;

      --spec-header-bg: #3a3a3a; // Darker fallbacks
      --spec-value-bg: #5a5a5a;
  }}


</style>