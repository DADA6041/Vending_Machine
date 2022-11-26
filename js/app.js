const vendingMachine = document.querySelector('.wrap-vend');
const itemList = vendingMachine.querySelector('.cola-list');
const leftVal =  vendingMachine.querySelector('.txt-changes');
const btnChange = vendingMachine.querySelector('.btn-money');
const smallColaList = vendingMachine.querySelector('.list-take-cola');
const itemBtn = vendingMachine.querySelectorAll('.cola-list button');

const valInput = vendingMachine.querySelector('#inPutMoney');
const btnInput = vendingMachine.querySelector('.btn-put-money');
const btnTake = vendingMachine.querySelector('.btn-take');

const myInfo = document.querySelector('.wrap-info');
const budget = myInfo.querySelector('#budget');
const purchaseList = myInfo.querySelector('.list-take-cola');
const txtTotal = myInfo.querySelector('.txt-total');

async function getColaData() {
    const response = await fetch('./js/item.json');
    if(response.ok) {
        const colaData = await response.json();
        return colaData;
    } else{
        alert('실패!!' + response.status);
    }
}

async function colaFactory(data) {
    const myCola = await getColaData();
    const docFrag = document.createDocumentFragment();
    myCola.forEach(item => {
        const itemLi = document.createElement('li');
        const liTemplate = `
            <button type="button" class="btn-item" data-name="${item.name}" data-count="${item.count}" data-img="${item.img}" data-cost="${item.cost}">
                <img class="img-item" src="images/${item.img}" alt="${item.name}">
                <strong class="txt-item">${item.name}</strong>
                <span class="btn-price">${item.cost}원</span>
            </button>
            `
        itemLi.innerHTML = liTemplate;
        docFrag.appendChild(itemLi);
    });
    itemList.appendChild(docFrag); 
    selectItem(itemList); 
} 
colaFactory(); 

function selectItem(itemList){
    const selectBtn = itemList.querySelectorAll('button');
    selectBtn.forEach((item) => {
        item.addEventListener('click', (e) =>{
            const targetEl = e.currentTarget;
            const leftMoneyVal = parseInt(leftVal.textContent.replaceAll(',',''));
            const targetElCost = parseInt(targetEl.dataset.cost);
            const basketList = smallColaList.querySelectorAll('li');
            let isExist = false;

            if(leftMoneyVal >= targetElCost){
                leftVal.textContent = new Intl.NumberFormat().format(leftMoneyVal - targetElCost) + '원';

                for(const item of basketList){
                    if(item.dataset.name === targetEl.dataset.name){
                        item.querySelector('.num-counter').textContent++;
                        isExist = true;
                        break;
                    }
                }

                if(!isExist){
                    addBasketList(targetEl);
                }

                targetEl.dataset.count--;
                if (targetEl.dataset.count == 0) {
                    targetEl.parentNode.classList.add('sold-out');
                    alert('상품이 품절되었습니다! :)');
                }
            } else {
                alert('잔액이 부족합니다!! :)')
            }
        })
    })
}

function addBasketList(target){
    const getList = document.createElement('li');
    getList.dataset.name = target.dataset.name;
    getList.dataset.cost = target.dataset.cost;
    getList.innerHTML = `
        <button type="button" class="btn-staged">
            <img src="images/${target.dataset.img}" alt="" class="img-item">
            <strong class="txt-item">${target.dataset.name}</strong>
            <span class="num-counter">1</span>
        </button>
    `;
    smallColaList.appendChild(getList);
}

function getChange(){
    const leftMoneyVal = parseInt(leftVal.textContent.replaceAll(',',''));
    const budgetVal = parseInt(budget.textContent.replaceAll(',',''));

    budget.textContent = new Intl.NumberFormat().format(budgetVal + leftMoneyVal) + ' 원';

    leftVal.textContent = '0 원';
}

function inpMoney(event){
    const inpMoneyVal = parseInt(valInput.value);
    const budgetVal = parseInt(budget.textContent.replaceAll(',',''));
    const leftMoneyVal = parseInt(leftVal.textContent.replaceAll(',',''));

    if(inpMoneyVal <= budgetVal && inpMoneyVal > 0){
        budget.textContent = new Intl.NumberFormat().format(budgetVal - inpMoneyVal) + ' 원';
        leftVal.textContent = new Intl.NumberFormat().format(leftMoneyVal + inpMoneyVal) + ' 원';
    } else if(isNaN(inpMoneyVal)) {
        alert('입금액을 입력해 주세요!! :)');
    } else {
        alert('소지금이 부족합니다!! :)');
    }
    valInput.value = null;
}

btnTake.addEventListener('click', (e) => {
    let isPurchase = false;
    let totalSum = 0;

    const selectedItem = smallColaList.querySelectorAll('li');
    const purchaseItem = purchaseList.querySelectorAll('li');

    for (let selected of selectedItem){
        for(let purchase of purchaseItem){
            let purchaseVal = purchase.querySelector('.num-counter');
            if (selected.dataset.name === purchase.dataset.name) {
                purchaseVal.textContent = parseInt(purchaseVal.textContent) + parseInt(selected.querySelector('.num-counter').textContent);
                isPurchase = true;
                break;
            }
        }
        if(!isPurchase) {
            purchaseList.appendChild(selected);
        }
    }
    smallColaList.innerHTML = null;

    const getTotal = purchaseList.querySelectorAll('li');
    getTotal.forEach((item) =>{
        totalSum += item.dataset.cost * parseInt(item.querySelector('.num-counter').textContent);
    })
    txtTotal.textContent = `총금액 : ${new Intl.NumberFormat().format(totalSum)}원`;
});

btnChange.addEventListener('click', getChange);
btnInput.addEventListener('click', inpMoney);