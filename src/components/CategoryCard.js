// Importeer de React-bibliotheek
import React from "react";

// Definieer een functioneel React-component genaamd 'CategoryCard'
function CategoryCard ({image, title, onClick}) {
    // Geef het JSX-element terug dat moet worden gerenderd
    return(
        // Maak een div-element met de klasse 'category-card' en een onClick-event
        <div className="category-card" onClick={onClick}>
            {/*  Voeg een afbeeldingselement toe met de src en alt attributen */}
            <img src={image} alt={title} />
            {/*  Voeg een h3-element toe om de titel weer te geven */}
            <h3>{title}</h3>
        </div>
    );
}

// Exporteer het 'CategoryCard' component om het in andere bestanden te kunnen gebruiken
export default CategoryCard;
