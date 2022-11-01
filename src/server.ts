import app from './app';
import './database/connection';

app.listen(4000, () => {
    console.log('Server started on port 4000');
});
