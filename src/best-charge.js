function bestCharge(selectedItems) {
  let allItems = loadAllItems();
  let promotionsArr = loadPromotions();
  let bestPrice = originalPrice(allItems,selectedItems,promotionsArr);
}

function originalPrice(all,selected,promotions) {
  let count = [];
  for(let countIndex = 0; countIndex < selected.length; ++countIndex) {
    count.push(selected[countIndex].split(' x ')[1]);
  }
  let name = [];
  for(let nameIndex = 0; nameIndex < selected.length; ++nameIndex) {
    name.push(selected[nameIndex].split(' x ')[0]);
  }
  let price = [];
  let originalPrice = 0;
  for(let allArrIndex = 0; allArrIndex < count.length; ++allArrIndex) {
    all.forEach((item) => {
      if (item.id === name[allArrIndex]) {
        originalPrice += item.price * count[allArrIndex];
      }
    })
  }
  let finalPrice = comparePrice(name,count,price,promotions,originalPrice);
  return finalPrice;
}

function comparePrice(name,count,price,promotions,originalPrice) {
  if (originalPrice > 30) {
    let aboveThirtyDiscount = originalPrice - 6;
    let specialCount = specialDiscount(name,count,price,promotions,originalPrice);
    if (aboveThirtyDiscount > specialCount) {
      return [specialCount,2];
    } else {
      return [aboveThirtyDiscount,1];
    }
  } else {
    if (specialDiscount(name,count,price,promotions,originalPrice) === originalPrice) {
      return [originalPrice,3];
    } else {
      return [specialDiscount(name,count,price,promotions,originalPrice),2];
    }
  }
}

function specialDiscount(name,count,price,promotions,originalPrice) {
  let specialPrice = 0;
  name.forEach((item,index) => {
    if(promotions[1].items.includes(item)) {
      specialPrice += (count[index] * price[index]) / 2;
    } else {
      specialPrice += count[index] * price[index];
    }
  })
  if(price === 0) {
    return originalPrice;
  }
  return specialPrice;
}