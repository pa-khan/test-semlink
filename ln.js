const fs = require('fs');
const path = require('path');

// Функция для удаления ссылки (символической или жесткой) в зависимости от ОС
function removeLink(targetPath) {
    if (process.platform === 'win32') {
        // Для Windows удаляем жесткую ссылку
        try {
            fs.rmdirSync(targetPath, { recursive: true });
        } catch (error) {
            // Выводим сообщение об ошибке при удалении
            console.error(`Error removing link: ${error}`);
        }
    } else {
        // Для Linux/MacOS удаляем символическую ссылку
        try {
            fs.unlinkSync(targetPath);
        } catch (error) {
            // Выводим сообщение об ошибке при удалении
            console.error(`Error removing symlink: ${error}`);
        }
    }
}

// Функция для создания символической или жесткой ссылки в зависимости от ОС
function createLink(sourcePath, targetPath) {
    // Удаляем существующую ссылку, если она есть
    removeLink(targetPath);

    if (process.platform === 'win32') {
        // Для Windows используем жесткую ссылку с помощью mklink
        const cmd = `mklink /J "${targetPath}" "${sourcePath}"`;
        console.log(`Executing command: ${cmd}`);
        try {
            // Выполнить команду mklink через командную строку
            require('child_process').execSync(cmd, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error creating link: ${error}`);
        }
    } else {
        // Для Linux/MacOS используем символическую ссылку с помощью fs.symlink
        fs.symlink(sourcePath, targetPath, 'junction', (err) => {
            if (err) {
                console.error(`Error creating symlink: ${err}`);
            } else {
                console.log(`Symlink created from ${sourcePath} to ${targetPath}`);
            }
        });
    }
}

// Пути к папке shared и целевым папкам (backend и frontend)
const sharedPath = path.join(__dirname, 'shared');
const backendPath = path.join(__dirname, 'backend', 'src/shared');
const frontendPath = path.join(__dirname, 'frontend', 'src/shared');

// Создаем ссылку в проекте backend
createLink(sharedPath, backendPath);

// Создаем ссылку в проекте frontend
createLink(sharedPath, frontendPath);
