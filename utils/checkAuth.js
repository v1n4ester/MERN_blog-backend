import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token) {
        try{
            const decoded = jwt.verify(token, 'secret123') // розшифровуєм по ключу
            
            req.userId = decoded._id
        }catch(e) {
            return res.status(403).json({
                message: 'Немає доступу'
            })
        }
    }else {
        return res.status(403).json({
            message: 'Немає доступу'
        })
    }

    next() // працює як return і закінчує виконання цієї функції
}