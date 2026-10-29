const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'database.sqlite', logging: false });

const Author = sequelize.define('authors', { name: DataTypes.TEXT, country: DataTypes.TEXT, });

const Book = sequelize.define('books', { title: DataTypes.TEXT, year: DataTypes.NUMBER, genre: DataTypes.TEXT });

Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' }); Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

async function main() { try { await sequelize.authenticate(); console.log('Соединение установлено.');

    await sequelize.sync({ force: true });
    console.log('Таблицы созданы.');

    const author = await Author.create({ 
        name: 'Лев Толстой', 
        country: 'Россия' 
    });

    await author.createBook({ 
        title: 'Война и мир', 
        year: 1869, 
        genre: 'Роман' 
    });
    
    await author.createBook({ 
        title: 'Анна Каренина', 
        year: 1877, 
        genre: 'Роман' 
    });
    console.log('Данные добавлены.');

    const result = await Author.findOne({
        where: { name: 'Лев Толстой' },
        include: [{
            model: Book,
            as: 'books'
        }]
    });

    console.log('\n--- Результат ---');
    console.log(`Автор: ${result.name} (${result.country})`);
    console.log('Книги:');
    result.books.forEach(book => {
        console.log(` - "${book.title}" (${book.year} г., жанр: ${book.genre})`);
    });

} catch (error) {
    console.error('Ошибка:', error);
} finally {
    await sequelize.close();
    console.log('\nСоединение закрыто.');
}
}

main();