import React from "react";

function CategoryCard ({image, title, onClick}) {

    return(
        <div className="category-card" onClick={onClick}>

            <img src={image} alt={title} />
            <h3>{title}</h3>
        </div>
    );

}

export default CategoryCard;