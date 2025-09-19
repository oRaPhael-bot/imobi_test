document.addEventListener("DOMContentLoaded", function () {
  const priceRangeInput = document.getElementById("priceRangeInput");
  const priceValue = document.getElementById("priceValue");
  const filterCheckboxes = document.querySelectorAll(
    '.filter-section input[type="checkbox"]'
  );
  const priceRadioButtons = document.querySelectorAll(
    '.filter-section input[type="radio"]'
  );
  const locationSearch = document.getElementById("location-search");
  const locationSuggestions = document.getElementById("location-suggestions");

  const details = {
    mainImage: document.getElementById("details-main-image"),
    title: document.getElementById("details-title"),
    address: document.getElementById("details-address"),
    price: document.getElementById("details-price"),
    overview: document.getElementById("details-overview"),
    features: document.getElementById("details-features"),
  };

  let states = [];

  // Busca estados da API do IBGE e popula as sugestões
  fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
  )
    .then((response) => response.json())
    .then((data) => {
      states = data.map((estado) => estado.nome);
    });

  // Mostra sugestões ao focar ou digitar
  locationSearch.addEventListener("input", () =>
    updateLocationSuggestions(locationSearch.value)
  );
  locationSearch.addEventListener("focus", () =>
    updateLocationSuggestions(locationSearch.value)
  );

  function updateLocationSuggestions(filter) {
    if (filter.length < 1) {
      locationSuggestions.style.display = "none";
      return;
    }

    const filteredStates = states.filter((state) =>
      state.toLowerCase().includes(filter.toLowerCase())
    );

    locationSuggestions.innerHTML = "";
    if (filteredStates.length > 0) {
      locationSuggestions.style.display = "block";
      filteredStates.forEach((state) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.textContent = state;
        suggestionItem.addEventListener("click", () => {
          locationSearch.value = state;
          locationSuggestions.style.display = "none";
          filterProperties();
        });
        locationSuggestions.appendChild(suggestionItem);
      });
    } else {
      locationSuggestions.style.display = "none";
    }
  }

  // Esconde sugestões ao clicar fora
  document.addEventListener("click", function (e) {
    if (!locationSearch.contains(e.target)) {
      locationSuggestions.style.display = "none";
    }
  });

  // Limpa o filtro de localização se o campo for limpo
  locationSearch.addEventListener("change", () => {
    if (locationSearch.value === "") {
      filterProperties();
    }
  });

  function updateDetails(card) {
    const title = card.querySelector(".card-title").textContent;
    const address = card.querySelector(".card-text").innerText;
    const price = card.querySelector(".price").innerHTML;
    const mainImage = card.querySelector(".card-img-top").src;

    details.title.textContent = title;
    details.address.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${address}`;
    details.price.innerHTML = price;
    details.mainImage.src = mainImage;

    const overviewText = `Detalhes sobre ${title}. Experience a peaceful escape at this property, a modern retreat set on a quiet hillside with stunning views.`;
    details.overview.querySelector("p").textContent = overviewText;
  }

  function filterProperties() {
    const selectedTypes = Array.from(filterCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.id);

    let priceFilterElement = document.querySelector(
      'input[name="priceRange"]:checked'
    );
    let priceFilter = priceFilterElement ? priceFilterElement.id : "custom";
    const customPrice = parseInt(priceRangeInput.value, 10);
    const locationQuery = locationSearch.value.toLowerCase();

    const propertyListings = document.querySelectorAll(
      "#property-listings .col-md-6"
    );

    propertyListings.forEach((property) => {
      const propertyType = property.dataset.type;
      const propertyPrice = parseInt(property.dataset.price, 10);
      const propertyState = (property.dataset.state || "").toLowerCase();

      let typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(propertyType);

      let locationMatch =
        locationQuery === "" || propertyState.includes(locationQuery);

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

      if (typeMatch && priceMatch && locationMatch) {
        property.style.display = "";
      } else {
        property.style.display = "none";
      }
    });
  }

  // --- Event Listeners ---

  if (priceRangeInput) {
    priceRangeInput.addEventListener("input", function () {
      if (priceValue) {
        priceValue.textContent = "$" + Number(this.value).toLocaleString();
      }
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
        document
          .querySelectorAll("#property-listings .property-card")
          .forEach((c) => c.classList.remove("active"));
        this.classList.add("active");
        updateDetails(this.closest(".col-md-6"));
      });
    });

  // --- Initial Load ---
  if (priceRangeInput && priceValue) {
    priceValue.textContent =
      "$" + Number(priceRangeInput.value).toLocaleString();
  }
  filterProperties();
});
