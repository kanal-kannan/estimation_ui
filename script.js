    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productItems");
    const productListContainer = document.getElementById("productList");
    const productCard = document.getElementById("productDetailsCard");
    const toast = document.getElementById("toast");
    const pdfLink = document.getElementById("pdfLink");
  
    const clientInputs = {
      name: document.querySelector('input[type="text"]'),
      phoneNumber: document.querySelector('input[type="tel"]'),
      date: document.querySelector('input[type="date"]'),
    };
  
    let products = [];
  
    function toggleProductForm() {
  const formCard = document.getElementById("productFormCard");
  formCard.classList.toggle("hidden");
}

  
    function showToast(message, color = "bg-green-500") {
  toast.className = `fixed top-5 right-5 text-white text-sm px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300 ${color}`;
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

  
    async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/estimations");
    if (!response.ok) throw new Error("Failed to fetch estimations");

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid data format");

    productList.innerHTML = "";
if (data.length === 0) {
  productList.innerHTML = `<tr><td colspan="8" class="px-4 py-2 text-center text-gray-500">No estimations found.</td></tr>`;
} else {
  data.forEach((item, index) => {
    productList.innerHTML += `
      <tr>
        <td class="px-4 py-2">${index + 1}</td>
        <td class="px-4 py-2">${item.clientName}</td>
        <td class="px-4 py-2">${item.phoneNumber}</td>
        <td class="px-4 py-2">${item.product}</td>
        <td class="px-4 py-2">${item.structure}</td>
        <td class="px-4 py-2">${item.finish}</td>
        <td class="px-4 py-2">₹${item.amount }</td>
        <td class="px-4 py-2 text-center">
        <a href="http://localhost:3000/api/estimations/${item.id}/pdf" target="_blank" title="Download PDF">
            📄
          </a>
        </td>
      </tr>`;
  });
}


    productListContainer.classList.remove("hidden");
    showToast("Fetched estimations successfully!");
  } catch (err) {
    console.error(err);
    showToast("Error fetching estimations", "bg-red-500");
  }
}

  
productForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productData = {
    product: productForm.product.value,
    structure: productForm.structure.value,
    finish: productForm.finish.value,
    length: parseFloat(productForm.length.value),
    breadth: parseFloat(productForm.breadth.value),
    rate: parseFloat(productForm.rate.value),
  };

  const clientData = {
    clientName: clientInputs.name.value,
    phoneNumber: clientInputs.phoneNumber.value,
    date: clientInputs.date.value,
  };
const includeTransportationEl = document.getElementById("includeTransportation");
const includeTransportation = includeTransportationEl ? includeTransportationEl.checked : false;
const includeGST = true; // GST is always included by default


  const hasEmpty = Object.values({ ...productData, ...clientData }).some(v => !v);
  if (hasEmpty) {
    showToast("All fields must be filled before submitting!", "bg-red-500");
    return;
  }

  const payload = {
  ...clientData,
  ...productData,
  includeTransportation,
  includeGST,
};


  try {
    const response = await fetch("http://localhost:3000/api/estimations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Failed to save estimation.");

    products.push(payload);
    productForm.reset();
updateSummary(result.subtotal, result.transportation, result.gst, result.amount);
    // ✅ Reset client input fields
    // clientInputs.name.value = "";
    // clientInputs.phoneNumber.value = "";
    // clientInputs.date.value = "";

    // ✅ Reset summary
    // updateSummary(0, 0, 0);

    toggleProductForm();
    showToast("Estimation saved successfully!");

    // ✅ PDF link for latest entry
    if (result.id) {
      pdfLink.href = "http://localhost:3000/api/estimations/${item.id}/pdf";
      pdfLink.classList.remove("hidden");
      showToast("PDF generated! Click to download.", "bg-blue-500");
    }

    // ✅ Refresh product list to show new entry with PDF link
    fetchProducts();

  } catch (err) {
    showToast(`Error: ${err.message}`, "bg-red-500");
  }
});

    function updateSummary(subtotal, transportation, gst, total) {
  document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("transportation").textContent = transportation > 0 ? `₹${transportation.toFixed(2)}` : `₹0.00`;
  document.getElementById("GST").textContent = `₹${gst.toFixed(2)}`;
  document.getElementById("totalAmount").textContent = `₹${total.toFixed(2)}`;
}




    
  
  function toggleProductForm() {
    const formCard = document.getElementById("productFormCard");
    formCard.classList.toggle("hidden");
  }

  const dateInput = document.getElementById('dateInput');
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
