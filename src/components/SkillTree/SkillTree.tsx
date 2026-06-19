import { useMemo } from 'react';
import ReactFlow, { type Node, type Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import type { SkillNode } from '../../types';
import { SkillNodeComponent } from './SkillNodeComponent';

const nodeTypes = { skillNode: SkillNodeComponent };

function computeBFSLayout(nodes: SkillNode[]): Map<string, { x: number; y: number }> {
  const depths = new Map<string, number>();

  nodes.forEach((n) => { if (n.dependencies.length === 0) depths.set(n.id, 0); });

  let changed = true;
  while (changed) {
    changed = false;
    for (const n of nodes) {
      if (depths.has(n.id)) continue;
      if (n.dependencies.every((d) => depths.has(d))) {
        depths.set(n.id, Math.max(...n.dependencies.map((d) => depths.get(d)!)) + 1);
        changed = true;
      }
    }
  }
  nodes.forEach((n) => { if (!depths.has(n.id)) depths.set(n.id, 0); });

  const groups = new Map<number, SkillNode[]>();
  nodes.forEach((n) => groups.set(depths.get(n.id)!, [...(groups.get(depths.get(n.id)!) || []), n]));

  const H_GAP = 200;
  const V_GAP = 160;
  const X_OFFSET = 400;

  const positions = new Map<string, { x: number; y: number }>();
  for (const [depth, group] of groups) {
    const totalW = (group.length - 1) * H_GAP;
    group.forEach((n, i) => {
      positions.set(n.id, {
        x: X_OFFSET + i * H_GAP - totalW / 2,
        y: 40 + depth * V_GAP,
      });
    });
  }

  return positions;
}

interface SkillTreeProps {
  nodes: SkillNode[];
  onNodeClick?: (nodeId: string) => void;
}

export function SkillTree({ nodes, onNodeClick }: SkillTreeProps) {
  const { flowNodes, flowEdges } = useMemo(() => {
    const layout = computeBFSLayout(nodes);

    const fn: Node[] = nodes.map((n) => ({
      id: n.id,
      type: 'skillNode',
      position: layout.get(n.id) ?? { x: 400, y: 40 },
      data: n,
    }));

    const fe: Edge[] = [];
    nodes.forEach((n) => {
      n.dependencies.forEach((depId, i) => {
        const dep = nodes.find((x) => x.id === depId);
        const isCompleted = dep?.status === 'completed';
        fe.push({
          id: `e-${depId}-${n.id}-${i}`,
          source: depId,
          target: n.id,
          type: 'smoothstep',
          animated: isCompleted,
          style: {
            stroke: isCompleted ? '#34d399' : '#475569',
            strokeWidth: isCompleted ? 2 : 1.5,
            strokeDasharray: isCompleted ? '8 4' : undefined,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isCompleted ? '#34d399' : '#475569',
            width: 16,
            height: 16,
          },
        });
      });
    });

    return { flowNodes: fn, flowEdges: fe };
  }, [nodes]);

  return (
    <div className="h-[480px] sm:h-[560px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}
