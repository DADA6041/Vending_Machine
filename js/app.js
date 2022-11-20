const vendingMachine = document.querySelector('.wrap-vend');
const itemList = vendingMachine.querySelector('.cola-list'); // 자판기 파트 아이템 <ul>
const leftVal =  vendingMachine.querySelector('.txt-changes'); // 잔액
const btnChange = vendingMachine.querySelector('.btn-money'); // 거스름돈 반환 버튼
const smallColaList = vendingMachine.querySelector('.list-take-cola'); // 자판기 파트 장바구니 <ul>
const itemBtn = vendingMachine.querySelectorAll('.cola-list button'); // 자판기 버튼

const valInput = vendingMachine.querySelector('#inPutMoney'); // 입금액 input
const btnInput = vendingMachine.querySelector('.btn-put-money'); // 입금버튼
const btnTake = vendingMachine.querySelector('.btn-take'); // 획득버튼

const myInfo = document.querySelector('.wrap-info');
const budget = myInfo.querySelector('#budget'); // 소지금
const purchaseList = myInfo.querySelector('.list-take-cola'); // 구매한 물건
const txtTotal = myInfo.querySelector('.txt-total'); // 총금액

// 콜라 데이터 불러오기

async function getColaData() {
    const response = await fetch('./js/item.json');
    // console.log(response);
    if(response.ok) {
        const colaData = await response.json();
        // console.log(colaData);
        return colaData;
        // colaFactory(colaData);
    } else{
        alert('실패!!' + response.status);
    }
}

// 받은 데이터로 자판기 리스트 뿌려주기
async function colaFactory(data) {
    const myCola = await getColaData();
    // console.log(myCola);
    const docFrag = document.createDocumentFragment();// 가상돔 빈 객체 생성
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
    // 장바구니 담기 함수로 넘겨줌
} 
colaFactory(); 

/*
* 자판기 메뉴 기능
* 아이템을 누르면 잔액 == 잔액 - 아이템 가격이 됩니다.
* 아이템 가격보다 잔액이 적다면 "잔액이 부족합니다. 돈을 입금해주세요" 경고창이 나타납니다.
* 아이템이 획득가능 창에 등록됩니다.
* 아이템 버튼의 data-count 값이 -1 됩니다.
* 만약 data-count 값이 0 이라면 부모 li에 sold-out 클래스를 붙여줍니다.
*/
function selectItem(itemList){
    const selectBtn = itemList.querySelectorAll('button');
    // console.log(selectBtn);
    selectBtn.forEach((item) => {
        item.addEventListener('click', (e) =>{
            const targetEl = e.currentTarget;
            // console.log(targetEl);
            const leftMoneyVal = parseInt(leftVal.textContent.replaceAll(',','')); // 잔액
            const targetElCost = parseInt(targetEl.dataset.cost); // 타겟의 가격 데이터
            // console.log(targetElCost);
            const basketList = smallColaList.querySelectorAll('li'); // 장바구니 li들
            let isExist = false; // 아이템이 이미 있나?

            if(leftMoneyVal >= targetElCost){
                leftVal.textContent = new Intl.NumberFormat().format(leftMoneyVal - targetElCost) + '원';

                //장바구니를 돌면서 list에 있으면 num-counter만 증가
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
                // console.log(targetEl.dataset.count);
                if (targetEl.dataset.count == 0) {
                    // console.log(targetEl.parentNode);
                    targetEl.parentNode.classList.add('sold-out');
                    alert('상품이 품절되었습니다! :)');
                }
            } else {
                alert('잔액이 부족합니다!! :)')
            }
        })
    })
}

// 장바구니에 list 붙이는 함수
function addBasketList(target){
    // console.log(target);
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

/*
* 거스름돈 반환
* 반환 버튼을 누르면 소지금 == 소지금 + 잔액이 됩니다.
* 반환 버튼을 누르면 잔액 창은 초기화됩니다.
*/
function getChange(){
    const leftMoneyVal = parseInt(leftVal.textContent.replaceAll(',','')); // 잔액
    const budgetVal = parseInt(budget.textContent.replaceAll(',','')); // 소지금
    // console.log(leftMoneyVal, budgetVal);

    budget.textContent = new Intl.NumberFormat().format(budgetVal + leftMoneyVal) + ' 원';

    leftVal.textContent = '0 원';
}
/** 입금하기
* 입금액을 입력하고 입금 버튼을 누르면 소지금 == 소지금 - 입금액, 잔액 == 기존 잔액 + 입금액이 됩니다.
* 입금액이 소지금 보다 많다면 실행을 중단하고 "소지금이 부족합니다." 라고 쓰인 경고창을 띄웁니다.
* 입금액 인풋창은 초기화됩니다
*/
function inpMoney(event){
    const inpMoneyVal = parseInt(valInput.value); // 입금액
    const budgetVal = parseInt(budget.textContent.replaceAll(',','')); // 소지금
    const leftMoneyVal = parseInt(leftVal.textContent.replaceAll(',','')); // 잔액
    // console.log(inpMoneyVal, budgetVal, leftMoneyVal);

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


/** 음료 획득하기
* 획득 버튼을 누르면 선택한 음료수 목록이 획득한 음료 목록으로 이동합니다.
* 획득한 음료의 금액을 모두 합하여 총금액을 업데이트 합니다.
*/

btnTake.addEventListener('click', (e) => {
    let isPurchase = false;
    let totalSum = 0;

    const selectedItem = smallColaList.querySelectorAll('li');
    const purchaseItem = purchaseList.querySelectorAll('li');

    for (let selected of selectedItem){
        // console.log(selected);
        for(let purchase of purchaseItem){
            let purchaseVal = purchase.querySelector('.num-counter');
            if (selected.dataset.name === purchase.dataset.name) {
                purchaseVal.textContent = parseInt(purchaseVal.textContent) + parseInt(selected.querySelector('.num-counter').textContent);
                isPurchase = true;
                break;
            }
        }
        if(!isPurchase) {
            // console.log(selected);
            purchaseList.appendChild(selected);
        }
    }
    smallColaList.innerHTML = null;

    const getTotal = purchaseList.querySelectorAll('li');
    getTotal.forEach((item) =>{
        // console.log(item.dataset.cost);
        totalSum += item.dataset.cost * parseInt(item.querySelector('.num-counter').textContent);
        // console.log(totalSum);
    })
    txtTotal.textContent = `총금액 : ${new Intl.NumberFormat().format(totalSum)}원`;
});

btnChange.addEventListener('click', getChange);
btnInput.addEventListener('click', inpMoney);


