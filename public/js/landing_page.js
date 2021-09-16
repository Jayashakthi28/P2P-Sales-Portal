import { db_get,firebaseConfig,db_insert} from "./firebase-util.js";

firebase.initializeApp(firebaseConfig);
const db=firebase.database();
const params = new URLSearchParams(window.location.search);
console.log(params);
const id = params.get("id");


firebase.auth().onAuthStateChanged(async (user) => {
    if(user){
        document.querySelector('.loading-cont').style.display='none';
    }
    else{
        document.querySelector('.loading-cont').style.display='flex';
        location.href='/index.html';
    }
});


function date_splitter(date){
    date=date.split('-');
    console.log(date);
    let txt;
    switch (+date[1]){
        case 1:
            txt=`${date[2]} Jan ${date[0]}`;
            break;
        case 2:
            txt=`${date[2]} Feb ${date[0]}`;
            break;
        case 3:
            txt=`${date[2]} Mar ${date[0]}`;
            break;
        case 4:
            txt=`${date[2]} Apr ${date[0]}`;
            break;
        case 5:
            txt=`${date[2]} May ${date[0]}`;
            break;
        case 6:
            txt=`${date[2]} Jun ${date[0]}`;
            break;
        case 7:
            txt=`${date[2]} Jul ${date[0]}`;
            break;
        case 8:
            txt=`${date[2]} Aug ${date[0]}`;
            break;
        case 9:
            txt=`${date[2]} Sept ${date[0]}`;
            break;
        case 10:
            txt=`${date[2]} Oct ${date[0]}`;
            break;
        case 11:
            txt=`${date[2]} Nov ${date[0]}`;
            break;
        case 12:
            txt=`${date[2]} Dec ${date[0]}`;
            break;
    }
    // console.log(txt);
    return txt;
}


let data = await db_get(db, `product/${id}`);
data = await data.val();
// console.log(data);
const product_price = data['price'];
const product_minOrder = data["minOrders"];
const product_remaining = data["remaining"];
document.querySelector('.basic_details').innerHTML = `
<div class="img_container">
    <div class="image_preview_wrap">
        <img src=${data["profile-img"]} alt="" class="image_preview">
    </div>
    <div class="image_select">
        <div class="image_nav_arrow">
            <img src="../assets/icons/nav_arrow.svg" alt="" id="image_nav_arrow_left">
        </div>
        <div class="image_select_wrap">
            <img class="img0" src=${data["profile-img"]} alt="">
        </div>
        <div class="image_select_wrap">
            <img class="img1" src=${data["product-des-imgs"][0]} alt="">
        </div>
        <div class="image_select_wrap">
            <img class="img2" src=${data["product-des-imgs"][1]} alt="">
        </div>
        <div class="image_select_wrap">
            <img class="img3" src=${data["product-des-imgs"][2]} alt="">
        </div>
        <div class="image_nav_arrow">
            <img src="../assets/icons/nav_arrow.svg" alt="" id="image_nav_arrow_right">
        </div>
    </div>
</div>
<div class="product_details">
    <h1 class="product_name">${data["name"]}</h1>
    <h3 class="product_price">Rs. ${product_price}</h3>
    <h3 class="product_due">${date_splitter(data['due-date'])}</h3>
    <hr>
    <ul class="detail_list">
        <li>
            <h4 class="detail_list_elements">Available: </h4>
            <h4 id="detail_quantiy">${product_remaining}/${data["quantity"]}</h4>
        </li>
        <li>
            <h4 class="detail_list_elements">Min-order: </h4>
            <h4 id="detail_quantiy"> ${product_minOrder} ${data['productScale']}</h4>
        </li>
        <li>
            <h4 class="detail_list_elements">Delivery:</h4>
            <h4 id="delivery"> ${data["delivery-available"]}</h4>
        </li>
        <li>
            <h4 class="detail_list_elements">Category: </h4>
            <h4 id="detail_type"> ${data["type"]}</h4>
        </li>
        <li>
            <h4 class="detail_list_elements">Manufact. date: </h4>
            <h4 id="detail_type"> March, 2021</h4>
        </li>
    </ul>
    <hr>
    
    <form class="product_buy">
        <div class="quantity_wrapper">
            <label for="quanity">Quantity</label>
            <input type="number"
            id="quantity" 
            name="quantity" 
            min=${product_minOrder}
            max=${product_remaining}
            value= ${product_minOrder}
            required
            >
        </div> 
        <h4 class="estimated_price">Estimated Price: Rs. ${product_price}</h4>
        <button type="submit" class="buy_button">
            Place Buy Request
        </button>
    </form>
</div>
`;

document.getElementById('quantity').addEventListener('input', function (){
    document.querySelector('.estimated_price').innerHTML =
        `Estimated Price: Rs. ${(this.value) * (product_price)}`;
})

document.querySelector('.description').innerHTML = `
<div class="product_address">
    <h3 class="product_address_label">Address: </h4>
    <h4 id="product_address_text">${data["street"]}, ${data["area"]}, ${data["district"]}, ${data["pincode"]}</h4>
    <div class="google_map">
        <h3>Map:</h3>
        <div class="map_wrapper">
        <div class="gmap_canvas">
        <iframe
          width="300"
          height="300"
          id="gmap_canvas"
          src="https://maps.google.com/maps?q=${data['subArea']},${data['area']},${data['district']}&ie=UTF8&iwloc=&output=embed"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
        ></iframe
        ><a href="https://yggtorrent-fr.com"></a><br /><style>
          .mapouter {
            position: relative;
            text-align: right;
            height: 300px;
            width: 300px;
          }</style
        ><a href="https://google-map-generator.com">embed google map</a
        ><style>
          .gmap_canvas {
            overflow: hidden;
            background: none !important;
            height: 300px;
            width: 300px;
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
          }
        </style>
      </div>
        </div>
    </div>
</div>
<div class="description_text">
    <h3>About:</h3>
    <h4>
        ${data["description"]}
    </h4>
</div>
`;

let seller_id = data["user-id"];
let seller = await db_get(db, `user/${seller_id}`);
seller = await seller.val();
// console.log(seller);
document.querySelector('.seller_details').innerHTML = `
<div class="seller_img_wrap">
    <img class="seller_img" src=${seller["profileImgUrl"]} alt="">
</div>
<div class="seller_name">
    <h3>${seller["Name"]}</h3>
</div>
<div class="seller_contact">
    <div class="seller_phone_no">
        <img src="../assets/icons/phone.svg" alt="">
        <h4 class="phone_no_text">${seller["phNo"]}</h4>
    </div>
    <div class="seller_address">
        <img src="../assets/icons/location.svg" alt="">
        <h4 class="seller_address">${seller["street"]}, ${seller["subArea"]}, ${seller["area"]}, ${seller["Pincode"]}</h4>
    </div>
</div>
`;

// image select and preview
const image_wrap = document.querySelector(".image_preview_wrap>img");
const image_select = document.querySelector('.image_select');

image_select.addEventListener('click', (e)=>{
    if(e.target.parentElement.className == 'image_select_wrap'){
        const selected_img = e.target.src;
        image_wrap.src = selected_img;
    }
    if(e.target.parentElement.className == 'image_nav_arrow') {
        //  Code to be done later
    }
})


/********************User Star Hover Functionality***************************************************/

const star_cont=document.querySelector('.star_count_1');
let star_num=1;
function star_hover_highlighter(num){
    document.querySelectorAll('.star_count_1 img').forEach(d=>{
        if(+d.id<=+num){
            d.src=`../assets/icons/star_filled.svg`;
        }
        else{
            d.src=`../assets/icons/star_unfilled.svg`
        }
    })
}

star_cont.addEventListener("mousedown",(e)=>{
    star_num=+e.target.id;
})

star_cont.addEventListener("mousemove",(e)=>{
    if(e.target.id.length===0) return; 
    star_hover_highlighter(e.target.id);
})

star_cont.addEventListener("mouseleave",(e)=>{
    star_hover_highlighter(star_num);
})

/************************************************************************************************** */

/**************************************************User Comment Poster*****************************************/
let user_cmt_data={
    'rating':'5',
    'heading':'Product Review',
    'comment':'asdfa',
}

const myReviewCont=document.querySelector('.my_review');
const postButton=document.querySelector('.post_button');
postButton.disabled=true;

myReviewCont.addEventListener("click",(e)=>{
    if(e.target.classList.contains('review_subject') || e.target.classList.contains('main_review_cont') || e.target.classList.length===0){
        return;
    }
    let head=myReviewCont.querySelector('.review_subject');
    let comment_review=myReviewCont.querySelector('.main_review_cont');
    console.log(comment_review.textContent.trim().length);
    if(head.textContent.trim().length===0 || head.textContent.trim()==='Product Review'){
        head.textContent='Product Review';
        postButton.classList.add('disabled_btn');
        postButton.disabled=true;
    }
    else{
        postButton.classList.remove('disabled_btn');
        postButton.disabled=false;
    }
    if(comment_review.textContent.trim().length===0 || comment_review.textContent.trim()==='Review Description'){
        console.log("Entering here");
        comment_review.textContent='Review Description';
        postButton.classList.add('disabled_btn');
        postButton.disabled=true;
    }
    else{
        postButton.classList.remove('disabled_btn');
        postButton.disabled=false;
    }
})

postButton.addEventListener('click',(e)=>{
    postButton.classList.add('disabled_btn');
    postButton.disabled=true;
    location.href='#';
})
