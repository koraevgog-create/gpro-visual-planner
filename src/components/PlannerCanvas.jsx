import { useMemo } from 'react';
import ReactFlow,{Background,Controls,MiniMap,MarkerType} from '@xyflow/react';
import PlannerNode from './PlannerNode.jsx';
const nodeTypes={planner:PlannerNode};
export default function PlannerCanvas({items,onSelect,onMove,selectedId}){
 const nodes=useMemo(()=>items.map(item=>({id:item.id,type:'planner',position:{x:item.x,y:item.y},data:{item,children:items.filter(x=>x.parentId===item.id).length},selected:selectedId===item.id})),[items,selectedId]);
 const edges=useMemo(()=>items.filter(x=>x.parentId).map(x=>({id:'e-'+x.id,source:x.parentId,target:x.id,type:'smoothstep',markerEnd:{type:MarkerType.ArrowClosed,width:12,height:12,color:'#667d99'},style:{stroke:'#667d99',strokeWidth:1.7}})),[items]);
 return <div className="canvas"><ReactFlow fitView fitViewOptions={{padding:.25}} nodes={nodes} edges={edges} nodeTypes={nodeTypes} nodesConnectable={false} elementsSelectable panOnDrag minZoom={.15} maxZoom={2.5} onNodeClick={(_,n)=>onSelect(n.id)} onPaneClick={()=>onSelect(null)} onNodeDragStop={(_,n)=>onMove(n.id,n.position)} onNodesDelete={()=>{}} deleteKeyCode={null}><Background color="#29364c" gap={24}/><MiniMap zoomable pannable nodeColor="#597ca6" style={{background:'#151f30',border:'1px solid #334256'}} maskColor="rgba(13,19,30,.55)"/><Controls showInteractive={false}/></ReactFlow></div>;
}
