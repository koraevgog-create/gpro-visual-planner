import {initialItems} from '../data/initialTree.js';
const KEY='gpro.visual-planner.v1';
const LINKS='gpro.visual-planner.links.v1';
const MODE='gpro.visual-planner.layout.v1';
export function loadItems(){try{const v=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(v)&&v.length&&v.every(x=>typeof x.id==='string'&&typeof x.title==='string'))return v;}catch{}return initialItems.map(x=>({...x}));}
export function saveItems(items){try{localStorage.setItem(KEY,JSON.stringify(items));return true;}catch{return false;}}
export function loadLinks(){try{const v=JSON.parse(localStorage.getItem(LINKS));return Array.isArray(v)?v:[];}catch{return [];}}
export function saveLinks(links){try{localStorage.setItem(LINKS,JSON.stringify(links));return true;}catch{return false;}}
export function loadMode(){try{return localStorage.getItem(MODE)==='free'?'free':'tree';}catch{return 'tree';}}
export function saveMode(mode){try{localStorage.setItem(MODE,mode);}catch{}}
export function exportItems(items,links=[]){const blob=new Blob([JSON.stringify({version:3,items,links},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='gpro-planner-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export async function importItems(file){const obj=JSON.parse(await file.text());if(!obj||!Array.isArray(obj.items)||!obj.items.length)throw Error('Файл не содержит карту');const ids=new Set();for(const n of obj.items){if(typeof n.id!=='string'||typeof n.title!=='string'||!Number.isFinite(n.x)||!Number.isFinite(n.y)||ids.has(n.id))throw Error('Некорректные данные');ids.add(n.id);}for(const n of obj.items){if(n.parentId!=null&&!ids.has(n.parentId))throw Error('Найдена ветка без родителя');}const links=Array.isArray(obj.links)?obj.links.filter(l=>l&&typeof l.id==='string'&&ids.has(l.source)&&ids.has(l.target)&&l.source!==l.target):[];return {items:obj.items,links};}
