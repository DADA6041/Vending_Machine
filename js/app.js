const vendingMachine = document.querySelector('.wrap-vend');
const leftVal =  vendingMachine.querySelector('.txt-changes'); // 잔액
const btnChange = vendingMachine.querySelector('.btn-money'); // 거스름돈 반환 버튼

const valInput = vendingMachine.querySelector('#inPutMoney'); // 입금액 input
const btnInput = vendingMachine.querySelector('.btn-put-money'); // 입금버튼
const btnTake = vendingMachine.querySelector('.btn-take'); // 획득버튼

const myInfo = document.querySelector('.wrap-info');
const budget = document.querySelector('#budget'); // 소지금


/*
* 거스름돈 반환
* 반환 버튼을 누르면 소지금 == 소지금 + 잔액이 됩니다.
* 반환 버튼을 누르면 잔액 창은 초기화됩니다.
*/
function getChange(){
    console.log('거스름돈 반환');
}

/** 입금하기
* 1. 입금액을 입력하고 입금 버튼을 누르면 소지금 == 소지금 - 입금액, 잔액 == 기존 잔액 + 입금액이 됩니다.
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
    } else {
        alert('소지금이 부족합니다!! :)');
    }
    valInput.value = null;
}


/** 음료 획득하기
* 획득 버튼을 누르면 선택한 음료수 목록이 획득한 음료 목록으로 이동합니다.
* 획득한 음료의 금액을 모두 합하여 총금액을 업데이트 합니다.
*/
function getItem(){
    console.log('음료획득');
}




btnChange.addEventListener('click', getChange);
btnInput.addEventListener('click', inpMoney);
btnTake.addEventListener('click', getItem);