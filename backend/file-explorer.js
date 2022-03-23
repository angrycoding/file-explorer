const
	FS = require('fs'),
	Path = require('path'),
	Chokidar = require('chokidar'),
	SocketIO = require('socket.io'),
	cwd = process.cwd(),
	server = require('http').createServer(),
	io = SocketIO(server, { cors: { origin: '*' } });

let watchPaths = [];

const showLog = (...args) => {
	const message = args.join(' ');
	console.info(`[ file-explorer ]`, message);
};

const isDirectory = (dirPath) => {
	try {
		const stats = FS.statSync(dirPath);
		return (stats.isDirectory());
	} catch (e) {}
	return false;
};

showLog('starting...');

process.argv.slice(2).forEach(path => {
	path = Path.resolve(cwd, path);
	if (!isDirectory(path)) {
		showLog(`directory "${path}" does not exists or not a directory, skipping...`);
	} else {
		showLog(`watching directory "${path}"`);
		watchPaths.push(path);
	}
});

if (!watchPaths.length) {
	showLog('no directories to watch, please specify some, quitting...');
	process.exit(1);
}


const makeResponse = (files) => {

	let result = {};

	files = files.map(fullPath => ({ fullPath, isDir: isDirectory(fullPath) }));
	files = files.sort((a, b) => b.isDir - a.isDir);

	files.forEach(file => {
		result[file.fullPath] = {
			isDir: file.isDir
		};
	})

	return result;
}


io.on('connect', (socket) => {
	socket.emit('init', watchPaths);

	socket.on('preload', (path, ret) => {
		
		if (path === '/') {
			return ret(makeResponse(watchPaths));
		}

		FS.readdir(path, (error, files) => {
			if (error) return ret([]);
			files = files.filter(file => !file.startsWith('.'));
			files = files.map(file => Path.resolve(path, file));
			ret(makeResponse(files));
		})
	});


});



const watcher = Chokidar.watch([watchPaths], {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	ignoreInitial: true
});


watcher.on('add', (path) => io.emit('add', path, false));
watcher.on('addDir', (path) => io.emit('add', path, true));
watcher.on('unlink', (path) => io.emit('remove', path));
watcher.on('unlinkDir', (path) => io.emit('remove', path));


showLog('scanning...');
watcher.on('ready', () => {
	server.listen(9999, () => {
		showLog('ready, now open web browser!');
	});
});