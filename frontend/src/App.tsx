import TreeView from './components/TreeView/TreeView';
import ContextProcessor from './Context/Context';

export default () => {
	return (
		<ContextProcessor>
			<TreeView />
		</ContextProcessor>
	);
};