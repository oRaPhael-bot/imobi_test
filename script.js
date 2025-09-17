document.addEventListener("DOMContentLoaded", function () {
  const propertyCards = document.querySelectorAll(".property-card");
  const priceRangeInput = document.getElementById("priceRangeInput");
  const priceValue = document.getElementById("priceValue");
  const filterCheckboxes = document.querySelectorAll(
    '.filter-section input[type="checkbox"]'
  );
  const priceRadioButtons = document.querySelectorAll(
    '.filter-section input[type="radio"]'
  );

  const details = {
    mainImage: document.getElementById("details-main-image"),
    title: document.getElementById("details-title"),
    address: document.getElementById("details-address"),
    price: document.getElementById("details-price"),
    overview: document.getElementById("details-overview"),
    features: document.getElementById("details-features"),
  };

  function updateDetails(card) {
    const title = card.querySelector(".card-title").textContent;
    const address = card.querySelector(".card-text").innerText;
    const price = card.querySelector(".price").innerHTML;
    const mainImage = card.querySelector(".card-img-top").src;

    details.title.textContent = title;
    details.address.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${address}`;
    details.price.innerHTML = price;
    details.mainImage.src = mainImage;

    // Aqui você pode adicionar lógicas mais complexas para buscar
    // e atualizar a visão geral, features e outras abas.
    // Por enquanto, vamos usar um texto genérico.
    const overviewText = `Detalhes sobre ${title}. Experience a peaceful escape at this property, a modern retreat set on a quiet hillside with stunning views.`;
    details.overview.querySelector("p").textContent = overviewText;

    // Exemplo de como atualizar as features (você precisaria ter esses dados nos cards)
    // const featuresData = card.parentElement.dataset.features; // Ex: "6 Quartos,4 Banheiros,1 Garagem"
    // if(featuresData) {
    //   const featuresArray = featuresData.split(',');
    //   details.features.innerHTML = featuresArray.map(f => `<span>${f}</span>`).join('');
    // }
  }

  function filterProperties() {
    const selectedTypes = Array.from(filterCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.id);

    let priceFilter = document.querySelector(
      'input[name="priceRange"]:checked'
    ).id;
    const customPrice = parseInt(priceRangeInput.value, 10);

    const propertyListings = document.querySelectorAll(
      "#property-listings .col-md-6"
    );

    propertyListings.forEach((property) => {
      const propertyType = property.dataset.type;
      const propertyPrice = parseInt(property.dataset.price, 10);

      let typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(propertyType);

      let priceMatch = false;
      switch (priceFilter) {
        case "under1000":
          priceMatch = propertyPrice < 1000;
          break;
        case "1000to15000":
          priceMatch = propertyPrice >= 1000 && propertyPrice <= 15000;
          break;
        case "over15000":
          priceMatch = propertyPrice > 15000;
          break;
        case "custom":
          priceMatch = propertyPrice <= customPrice;
          break;
        default:
          priceMatch = true;
      }

      if (typeMatch && priceMatch) {
        property.style.display = "";
      } else {
        property.style.display = "none";
      }
    });
  }

  // Atualiza o valor do preço no carregamento da página
  if (priceRangeInput && priceValue) {
    priceValue.textContent =
      "$" + Number(priceRangeInput.value).toLocaleString();
    filterProperties();
  }

  // Adiciona o event listener para o input de range
  if (priceRangeInput) {
    priceRangeInput.addEventListener("input", function () {
      if (priceValue) {
        priceValue.textContent = "$" + Number(this.value).toLocaleString();
      }
      // Força a seleção do rádio 'custom' ao mover o slider
      document.getElementById("custom").checked = true;
      filterProperties();
    });
  }

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterProperties);
  });

  priceRadioButtons.forEach((radio) => {
    radio.addEventListener("change", filterProperties);
  });

  document
    .querySelectorAll("#property-listings .property-card")
    .forEach((card) => {
      card.addEventListener("click", function () {
        // Remove a classe 'active' de todos os cards
        document
          .querySelectorAll("#property-listings .property-card")
          .forEach((c) => c.classList.remove("active"));

        // Adiciona a classe 'active' apenas no card clicado
        this.classList.add("active");

        // Atualiza o painel de detalhes
        updateDetails(this);
      });
    });
});
