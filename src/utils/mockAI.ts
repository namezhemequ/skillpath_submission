import type { SkillNode, DailyTask, AnimationPhase } from '../types';

function genId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function dayStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

const ML_TREE: SkillNode[] = [
  { id: 'n1', title: 'Python 基础', description: '掌握变量、数据结构、函数、模块等核心语法', estimatedHours: 15, difficulty: 1, resources: [{ title: 'Python 官方教程', url: 'https://docs.python.org/zh-cn/3/tutorial/', type: 'article' }, { title: 'Codecademy Python', url: 'https://codecademy.com/learn/learn-python-3', type: 'course', duration: '20h' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'n2', title: 'NumPy 数值计算', description: '掌握 ndarray、广播、向量化计算', estimatedHours: 10, difficulty: 1, resources: [{ title: 'NumPy 官方快速入门', url: 'https://numpy.org/doc/stable/user/quickstart.html', type: 'article' }], dependencies: ['n1'], status: 'locked', progress: 0 },
  { id: 'n3', title: 'Pandas 数据处理', description: '熟练使用 DataFrame 进行数据清洗、变换、聚合', estimatedHours: 12, difficulty: 1, resources: [{ title: 'Pandas 十分钟入门', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', type: 'article' }], dependencies: ['n2'], status: 'locked', progress: 0 },
  { id: 'n4', title: '线性代数', description: '理解向量、矩阵、特征值及其在 ML 中的应用', estimatedHours: 15, difficulty: 2, resources: [{ title: '3Blue1Brown 线性代数本质', url: 'https://www.3blue1brown.com/topics/linear-algebra', type: 'video', duration: '15集' }], dependencies: ['n1'], status: 'locked', progress: 0 },
  { id: 'n5', title: '概率与统计', description: '掌握概率分布、贝叶斯定理、假设检验', estimatedHours: 12, difficulty: 2, resources: [{ title: 'Khan Academy 统计与概率', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course' }], dependencies: ['n1'], status: 'locked', progress: 0 },
  { id: 'n6', title: '数据可视化', description: 'Matplotlib/Seaborn 数据图表制作', estimatedHours: 8, difficulty: 1, resources: [{ title: 'Matplotlib 教程', url: 'https://matplotlib.org/stable/tutorials/', type: 'article' }], dependencies: ['n3'], status: 'locked', progress: 0 },
  { id: 'n7', title: 'Scikit-learn 基础', description: '掌握回归、分类、聚类三大类算法', estimatedHours: 25, difficulty: 2, resources: [{ title: 'Andrew Ng 机器学习', url: 'https://www.coursera.org/learn/machine-learning', type: 'course', duration: '60h' }, { title: 'Scikit-learn 文档', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'article' }], dependencies: ['n3', 'n4', 'n5'], status: 'locked', progress: 0 },
  { id: 'n8', title: '模型评估与调优', description: '交叉验证、超参数调优、偏差方差权衡', estimatedHours: 10, difficulty: 2, resources: [{ title: 'Scikit-learn 模型选择', url: 'https://scikit-learn.org/stable/model_selection.html', type: 'article' }], dependencies: ['n7'], status: 'locked', progress: 0 },
  { id: 'n9', title: '实战项目', description: '端到端完成一个 ML 项目：数据清洗→建模→评估', estimatedHours: 12, difficulty: 2, resources: [{ title: 'Kaggle Titanic', url: 'https://www.kaggle.com/c/titanic', type: 'project' }], dependencies: ['n6', 'n8'], status: 'locked', progress: 0 },
];

const ML_TASKS: DailyTask[] = [
  { id: genId(), planId: '', nodeId: 'n1', title: '安装 Python 并运行 Hello World', description: '配置好开发环境', date: dayStr(0), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n1', title: '变量、数据类型与运算符练习', description: '掌握 int/float/str/list/dict', date: dayStr(0), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'n1', title: '编写猜数字小游戏', description: '综合练习条件判断和循环', date: dayStr(0), completed: false, order: 3 },
  { id: genId(), planId: '', nodeId: 'n1', title: '函数定义与模块导入', description: '理解 def/return/import', date: dayStr(1), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n2', title: 'NumPy 数组创建与切片', description: 'np.array/reshape/索引切片', date: dayStr(2), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n2', title: 'NumPy 广播与向量化', description: '理解 broadcasting 规则', date: dayStr(3), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n3', title: 'Pandas 数据清洗实战', description: 'read_csv→dropna→类型转换→描述统计', date: dayStr(4), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n3', title: 'groupby 分组聚合练习', description: '掌握 split-apply-combine', date: dayStr(5), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n4', title: '观看 3Blue1Brown 前 5 集', description: '建立向量空间几何直觉', date: dayStr(2), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'n5', title: '学习正态分布、二项分布', description: '理解 PMF/PDF/CDF', date: dayStr(3), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'n7', title: '用 Scikit-learn 训练线性回归', description: 'fit→predict→score 完整流程', date: dayStr(8), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n7', title: 'KNN vs Logistic Regression 对比', description: '编写对比实验', date: dayStr(10), completed: false, order: 1 },
];

function buildDefaultTree(goal: string): { skillTree: SkillNode[]; tasks: DailyTask[] } {
  const tree: SkillNode[] = [
    { id: 'd1', title: '领域基础概念', description: `了解 ${goal} 的核心概念和术语体系`, estimatedHours: 8, difficulty: 1, resources: [{ title: '搜索入门指南', url: '#', type: 'article' }], dependencies: [], status: 'unlocked', progress: 0 },
    { id: 'd2', title: '核心工具链', description: '掌握该领域最常用的 2-3 个工具', estimatedHours: 20, difficulty: 1, resources: [{ title: '官方文档', url: '#', type: 'article' }], dependencies: ['d1'], status: 'locked', progress: 0 },
    { id: 'd3', title: '关键方法论', description: '理解核心思路和最佳实践', estimatedHours: 15, difficulty: 2, resources: [{ title: '推荐课程', url: '#', type: 'course' }], dependencies: ['d1'], status: 'locked', progress: 0 },
    { id: 'd4', title: '实战练手', description: '完成 1-2 个小型实战项目', estimatedHours: 20, difficulty: 2, resources: [{ title: '练手项目', url: '#', type: 'project' }], dependencies: ['d2', 'd3'], status: 'locked', progress: 0 },
    { id: 'd5', title: '进阶专题', description: '深入 1-2 个感兴趣的细分方向', estimatedHours: 25, difficulty: 3, resources: [{ title: '进阶资料', url: '#', type: 'article' }], dependencies: ['d4'], status: 'locked', progress: 0 },
  ];
  const tasks: DailyTask[] = [
    { id: genId(), planId: '', nodeId: 'd1', title: `搜索并整理 ${goal} 入门文章`, description: '建立整体认知框架', date: dayStr(0), completed: false, order: 1 },
    { id: genId(), planId: '', nodeId: 'd1', title: `整理 ${goal} 10 个核心术语`, description: '确保后续学习不卡在概念上', date: dayStr(0), completed: false, order: 2 },
    { id: genId(), planId: '', nodeId: 'd2', title: `安装配置 ${goal} 开发环境`, description: '环境搭建是第一步', date: dayStr(1), completed: false, order: 1 },
    { id: genId(), planId: '', nodeId: 'd3', title: `阅读 ${goal} 最佳实践总结`, description: '了解什么是好的做法', date: dayStr(2), completed: false, order: 1 },
    { id: genId(), planId: '', nodeId: 'd4', title: `完成 ${goal} Hello World 项目`, description: '跑通第一个完整流程', date: dayStr(4), completed: false, order: 1 },
  ];
  return { skillTree: tree, tasks };
}

export function generateMockPlan(goal: string): { skillTree: SkillNode[]; tasks: DailyTask[] } {
  if (goal.includes('机器学习') || goal.includes('ML') || goal.includes('machine learning')) {
    const tasksWithPlanId = ML_TASKS.map((t) => ({ ...t, planId: 'plan-placeholder' }));
    return { skillTree: ML_TREE, tasks: tasksWithPlanId };
  }
  return buildDefaultTree(goal);
}

export function getAnimationPhases(): AnimationPhase[] {
  return [
    { text: '正在分析你的学习目标，提取关键知识域...', icon: '🔍' },
    { text: '识别核心技能节点，评估难度与依赖...', icon: '🧩' },
    { text: '构建技能依赖关系图，规划学习路径...', icon: '🔗' },
    { text: '生成每日最小行动清单，降低启动门槛...', icon: '📋' },
  ];
}
