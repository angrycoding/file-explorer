import React, { CSSProperties } from 'react';
import { Context, FSItem } from '../../Context/Context';
import styles from './TreeViewItem.module.scss';
import clsx from 'clsx';

interface Props {
	level: number;
	path: string;
	fsItem: FSItem;
}

interface State {
	expanded: boolean;
}

export default class TreeViewItem extends React.Component<Props, State> {

	static contextType = Context;
	context: React.ContextType<typeof Context>;

	constructor(props: Props, context: React.ContextType<typeof Context>) {
		super(props);
		this.state = { expanded: false };
		this.context = context;
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		const { path, fsItem } = this.props;
		if (!fsItem.isDir) return;

		if (this.state.expanded) {
			this.setState({ expanded: false });
			this.context.unloadChildren(path);
		}

		else {
			this.setState({ expanded: true });
			this.context.loadChildren(path);
		}

	}

	render() {
		const { path, fsItem, level } = this.props;
		const { expanded } = this.state;
		
		return <div style={{'--level': level} as CSSProperties}>

			<div onClick={this.onClick} className={styles.item}>
				<div className={clsx(
					styles.icon,
					fsItem.isDir && !expanded && styles.plus,
					fsItem.isDir && expanded && styles.minus
				)}></div>

				{path.split('/').pop() || ''}
			</div>


			{fsItem.children && expanded && Object.entries(fsItem.children).map(entry => (
				<TreeViewItem key={entry[0]} path={entry[0]} fsItem={entry[1] as FSItem} level={level + 1} />
			))}

		</div>;

	}
}