import { useEffect } from 'react';
import type { SkillNode } from '../../types';

interface Props {
  node: SkillNode;
  allNodes: SkillNode[];
  onClose: () => void;
}

const difficultyText = { 1: '入门', 2: '进阶', 3: '挑战' };
const difficultyColor = { 1: 'text-emerald-400', 2: 'text-amber-400', 3: 'text-red-400' };
const difficultyBg = { 1: 'bg-emerald-500/10 border-emerald-500/30', 2: 'bg-amber-500/10 border-amber-500/30', 3: 'bg-red-500/10 border-red-500/30' };

const resourceIcon: Record<string, string> = {
  article: '文',
  video: '视',
  course: '课',
  project: '项',
};

function getNodeOutcome(node: SkillNode, dependents: SkillNode[]): string {
  const t = node.title + node.description;

  // Domain-specific outcomes based on keyword matching
  if (t.includes('Python') && t.includes('基础')) return '能用 Python 写脚本处理日常任务：批量重命名文件、抓取网页数据、自动发送邮件。这是你进入编程世界的第一把钥匙。';
  if (t.includes('NumPy')) return '能高效处理百万级数值数据，用向量化计算替代 Python 循环，速度提升 10-100 倍。数据分析和机器学习的基础运算都依赖它。';
  if (t.includes('Pandas')) return '能独立完成数据清洗全流程：读取杂乱 CSV → 处理缺失值 → 分组聚合 → 输出干净的分析就绪数据集。这是数据分析师 80% 的日常工作。';
  if (t.includes('线性代数')) return '理解机器学习算法的数学本质——为什么梯度下降能收敛、PCA 降维在做什么、神经网络的反向传播是如何计算的。不再是调包侠。';
  if (t.includes('概率') || t.includes('统计')) return '能判断 AB 测试结果是否显著、理解模型输出的概率含义、识别数据中的幸存者偏差和辛普森悖论。数据驱动的决策从概率思维开始。';
  if (t.includes('可视化') || t.includes('Matplotlib') || t.includes('Seaborn')) return '能把枯燥的数据变成有说服力的图表：趋势图讲增长故事、热力图发现关联、分布图暴露异常值。让数据自己说话。';
  if (t.includes('Scikit') || t.includes('sklearn')) return '能独立训练回归、分类、聚类模型，理解每个算法的适用场景和调参方向。这是从数据分析到机器学习的质变节点。';
  if (t.includes('模型评估') || t.includes('调优')) return '能判断模型是否过拟合、选择正确的评估指标、用网格搜索找到最优参数。学完这个，你的模型不再只是"跑通了"，而是"可用"。';
  if (t.includes('实战') || t.includes('项目')) return '能把所有零散技能串成端到端的工作流：从拿到原始数据到输出分析报告，独立交付一个完整的数据产品。';

  if (t.includes('Excel')) return '能用数据透视表 5 分钟完成别人半小时的手工统计，VLOOKUP 让多表关联不再靠复制粘贴。这是所有数据分析师的默认母语。';
  if (t.includes('SQL')) return '能独立从数据库提取任意维度的数据：多表 JOIN、子查询、窗口函数。面试中 80% 的数据分析岗都要求手写 SQL，学完这个你可以自信地面对。';
  if (t.includes('业务指标')) return '能看懂公司的核心看板，理解 DAU、留存率、转化率背后的业务含义。不再只是"取数工具人"，而是能参与业务讨论的数据伙伴。';
  if (t.includes('AB') || t.includes('实验')) return '能科学地设计实验、计算所需样本量、正确解读统计显著性。你的分析结论将有数据支撑，而不是"我觉得"。';

  if (t.includes('Rust') && t.includes('基础')) return '能用 Rust 写出安全、高效的控制台程序。你会惊讶地发现，编译器报错不是在刁难你，而是在保护你写出没有内存 bug 的代码。';
  if (t.includes('所有权') || t.includes('借用')) return '真正理解 Rust 为什么不需要 GC 却能保证内存安全。这套所有权思维会重塑你对所有编程语言的理解——包括 C++ 和 Go。';
  if (t.includes('并发')) return '能写出没有数据竞争的并发程序，编译器会在编译期帮你发现死锁隐患。这是 Rust 最令人上瘾的特性——并发不再可怕。';
  if (t.includes('Trait') || t.includes('泛型')) return '能用 trait 定义共享行为、用泛型写出可复用的抽象代码。这相当于其他语言中的接口+模板，但更安全、更表达力。';

  if (t.includes('乐理')) return '能看懂简谱和五线谱上的音符时值、节拍、调号。乐理不再是天书——它是你理解音乐的语言，所有乐器学习的通行证。';
  if (t.includes('坐姿') || t.includes('手型')) return '建立了正确的手型和坐姿习惯，避免长时间练习导致的腱鞘炎。好习惯是半年后还能继续弹琴的保障。';
  if (t.includes('五线谱') || t.includes('识谱')) return '能看着五线谱直接弹奏简单的旋律，拿到新谱子不再需要一个个数线与间的音名。识谱速度决定了你学新曲子的效率。';
  if (t.includes('和弦') || t.includes('即兴')) return '能用 C-Am-F-G 和弦进行给流行歌曲伴奏，甚至即兴弹出简单的旋律变奏。这是从"照着谱弹"到"自由演奏"的跃迁。';
  if (t.includes('合手') || t.includes('协调')) return '左右手能独立又协调地配合，这是钢琴最具挑战也最令人满足的阶段。突破合手瓶颈后，你能演奏的曲目量指数级增长。';
  if (t.includes('曲目') || t.includes('演奏')) return '能完整流畅地演奏 2-3 首钢琴名曲，在朋友圈或家庭聚会中自信地坐下来弹一曲。这是所有练习的意义所在。';

  // Fallback: use description and dependents to craft a meaningful outcome
  const depNames = dependents.map((d) => d.title).join('、');
  if (depNames) {
    return `掌握 ${node.title} 后，你就可以继续学习：${depNames}。这是学习路径中的关键一步。`;
  }
  return `掌握 ${node.title} 后，你将在该领域建立起一块重要的知识拼图。${node.description}`;
}

export function NodeDetailDrawer({ node, allNodes, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const deps = allNodes.filter((n) => node.dependencies.includes(n.id));
  const dependents = allNodes.filter((n) => n.dependencies.includes(node.id));

  const statusLabel: Record<string, string> = {
    locked: '未解锁',
    unlocked: '可学习',
    in_progress: '学习中',
    completed: '已完成',
  };
  const statusColor: Record<string, string> = {
    locked: 'bg-slate-700 text-slate-400',
    unlocked: 'bg-indigo-500/20 text-indigo-400',
    in_progress: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full sm:w-[420px] max-w-full bg-slate-900 border-l border-slate-800 h-full overflow-y-auto animate-slide-in-right"
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-100">节点详情</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 text-xs rounded-full border ${statusColor[node.status]}`}>
                {statusLabel[node.status]}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full border ${difficultyBg[node.difficulty]} ${difficultyColor[node.difficulty]}`}>
                {difficultyText[node.difficulty]}
              </span>
              <span className="text-xs text-slate-500">{node.estimatedHours}h</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{node.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{node.description}</p>
          </div>

          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">学完后能做什么</div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {getNodeOutcome(node, dependents)}
            </p>
          </div>

          {node.progress > 0 && (
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>学习进度</span>
                <span>{node.progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${node.progress}%` }}
                />
              </div>
            </div>
          )}

          {deps.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">前置依赖</div>
              <div className="space-y-2">
                {deps.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${d.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className={`text-sm ${d.status === 'completed' ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {d.title}
                    </span>
                    {d.status === 'completed' && (
                      <span className="ml-auto text-xs text-emerald-500">已完成</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {dependents.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">解锁后可学</div>
              <div className="space-y-2">
                {dependents.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{d.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {node.resources.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">推荐资源</div>
              <div className="space-y-2">
                {node.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-all group"
                  >
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-xs font-medium text-slate-400 flex-shrink-0">
                      {resourceIcon[r.type] ?? '资'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-200 group-hover:text-indigo-300 truncate transition-colors">
                        {r.title}
                      </div>
                      {r.duration && (
                        <div className="text-xs text-slate-500 mt-0.5">{r.duration}</div>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
