const carPrices = {
    'Model 1': 20000,
    'Model 2': 25000,
    'Model 3': 30000,
    'Model 4': 35000
  };
  
  const carModel = document.getElementById('car');
  const quantity = document.getElementById('quantity');
  const totalPrice = document.getElementById('total');
  
  function calculateTotalPrice() {
    const selectedCar = carModel.value;
    const selectedQuantity = quantity.value;
  
    if (selectedCar && selectedQuantity) {
      const pricePerCar = carPrices[selectedCar];
      const total = pricePerCar * selectedQuantity;
      totalPrice.value = total;
    } else {
      totalPrice.value = '';
    }
  }
  
  carModel.addEventListener('change', calculateTotalPrice);
  quantity.addEventListener('change', calculateTotalPrice);
  