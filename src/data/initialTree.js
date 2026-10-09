export const initialItems = [
  {id:'root',parentId:null,title:'Моя жизнь',type:'area',status:'active',notes:'Главная карта направлений',x:60,y:320},
  {id:'family',parentId:'root',title:'Семья',type:'area',status:'active',notes:'',x:360,y:20},
  {id:'finance',parentId:'root',title:'Финансы',type:'area',status:'active',notes:'',x:360,y:175},
  {id:'work',parentId:'root',title:'Проекты',type:'project',status:'active',notes:'',x:360,y:330},
  {id:'health',parentId:'root',title:'Здоровье',type:'area',status:'active',notes:'',x:360,y:485},
  {id:'growth',parentId:'root',title:'Развитие',type:'area',status:'active',notes:'',x:360,y:640},
  {id:'budget',parentId:'finance',title:'Бюджет',type:'task',status:'todo',notes:'',x:660,y:125},
  {id:'savings',parentId:'finance',title:'Накопления',type:'goal',status:'todo',notes:'',x:660,y:230},
  {id:'planning',parentId:'work',title:'Мой первый проект',type:'project',status:'active',notes:'',x:660,y:330},
  {id:'activity',parentId:'health',title:'Активность',type:'habit',status:'todo',notes:'',x:660,y:485},
  {id:'reading',parentId:'growth',title:'Чтение',type:'habit',status:'todo',notes:'',x:660,y:640}
];
