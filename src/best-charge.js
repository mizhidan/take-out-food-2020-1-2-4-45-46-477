function bestCharge(selectedItems) {
  let allItems = loadAllItems();
  let promotionsArr = loadPromotions();
  let originalPrice = calcOriginalPrice(allItems, selectedItems);
  let menuRes = comparePrice(allItems,selectedItems,promotionsArr,originalPrice
  );
  return showBest(menuRes);
}

function calcOriginalPrice(all, selected) {
  let count = [];
  for (let countIndex = 0; countIndex < selected.length; ++countIndex) {
    count.push(selected[countIndex].split(" x ")[1]);
  }
  let name = [];
  for (let nameIndex = 0; nameIndex < selected.length; ++nameIndex) {
    name.push(selected[nameIndex].split(" x ")[0]);
  }
  let price = [];
  for (let priceIndex = 0; priceIndex < selected.length; ++priceIndex) {
    all.forEach(item => {
      if (item.id === name[priceIndex]) {
        price.push(item.price);
      }
    });
  }
  let originalPrice = 0;
  for (let allArrIndex = 0; allArrIndex < count.length; ++allArrIndex) {
    all.forEach(item => {
      if (item.id === name[allArrIndex]) {
        originalPrice += item.price * count[allArrIndex];
      }
    });
  }
  return originalPrice;
}

function comparePrice(all, selected, promotions, originalPrice) {
  let count = [];
  let id = [];
  let price = [];
  let specialPrice = 0;
  let discountId = [];
  let discountItem = [];

  for (let countIndex = 0; countIndex < selected.length; ++countIndex) {
    count.push(selected[countIndex].split(" x ")[1]);
  }
  for (let idIndex = 0; idIndex < selected.length; ++idIndex) {
    id.push(selected[idIndex].split(" x ")[0]);
  }
  let name = idToName(id, all);
  for (let priceIndex = 0; priceIndex < selected.length; ++priceIndex) {
    all.forEach(item => {
      if (item.id === id[priceIndex]) {
        price.push(item.price);
      }
    });
  }
  if (originalPrice >= 30) {
    var overThirtyDiscount = originalPrice - 6;
  }
  id.forEach((item, index) => {
    if (promotions[1].items.includes(item)) {
      specialPrice += (count[index] * price[index]) / 2;
      discountId.push(item);
    } else {
      specialPrice += count[index] * price[index];
    }
  });
  discountItem = idToName(discountId, all);
  if (originalPrice < 30) {
    let flag = 0;
    let res = {
      itemsName: name,
      itemsCount: count,
      itemsPrice: price,
      isDiscount: flag,
      whichDiscount: discountFlag,
      discountItems: [],
      reduceMoney: decreasePrice,
      totalPrice: originalPrice
    };
    return res;
  }
  if (overThirtyDiscount > specialPrice) {
    var decreasePrice = originalPrice - specialPrice;
    var discountFlag = 1;
    var totalPrice = specialPrice;
  } else {
    var decreasePrice = originalPrice - overThirtyDiscount;
    var discountFlag = 2;
    var totalPrice = overThirtyDiscount;
  }

  let flag = 1;
  if (decreasePrice === 0) {
    flag = 0;
  }
  let res = {
    itemsName: name,
    itemsCount: count,
    itemsPrice: price,
    isDiscount: flag,
    whichDiscount: discountFlag,
    discountItems: discountItem,
    reduceMoney: decreasePrice,
    totalPrice: totalPrice
  };
  return res;
}

function idToName(idArray, all) {
  let name = [];
  idArray.forEach((idItem) => {
    all.forEach((allItem) => {
      if (idItem === allItem.id) {
        name.push(allItem.name);
      }
    })
  })
  return name;
}

function showBest(menu) {
  let selectedInfo = "";
  let discountInfo = "";
  let finalPrice = "";
  menu.itemsName.forEach((item,index) => {
    selectedInfo += `${item} x ${menu.itemsCount[index]} = ${menu.itemsCount[index] * menu.itemsPrice[index]}元\n`
  })
  finalPrice += `总计：${menu.totalPrice}元`;
    if (menu.whichDiscount === 1 && menu.isDiscount === 1) {
      discountInfo = `使用优惠:
指定菜品半价(${menu.discountItems.join("，")})，省${menu.reduceMoney}元
-----------------------------------`;

    } else if(menu.whichDiscount === 2 && menu.isDiscount === 1) {
      discountInfo = `使用优惠:
满30减6元，省${menu.reduceMoney}元
-----------------------------------`;
    }
  if (menu.isDiscount === 0) {
    var info =`
============= 订餐明细 =============
${selectedInfo}-----------------------------------
${finalPrice}
===================================
`
  } else {
    var info =`
============= 订餐明细 =============
${selectedInfo}-----------------------------------
${discountInfo}
${finalPrice}
===================================`
  }


return info;
}
