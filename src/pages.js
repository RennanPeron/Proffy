const {subjects, weekdays, getSubject, convertHoursToMinutes} =  require('./utils/format')

const database = require('./database/db')

let queryString
let filters

function pageLanding(req, res){
    return res.render("index.html")
}

async function pageStudy(req, res){
    // const filters = req.query
    console.log(queryString)
    if(queryString === undefined){
        console.log("E indefinido!")
        filters = req.query 
    } else {
        console.log("nao e indefinido")
        filters = queryString
        queryString = undefined
    }

    console.log(filters)
    
    // Caso algum  campo esteja vazio, mostra a pagina sem os proffys
    if(!filters.subject || !filters.weekday || !filters.time) {
        return res.render("study.html", {filters, subjects, weekdays})
    }
    console.log("Não tem campos vazios")

    // converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
        SELECT classes.*,  proffys.*
        FROM proffys
        JOIN classes on (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
            )
        AND  classes.subject = '${filters.subject}'
    `

    // caso haja erro na consulta com o banco de dados
    try {
        const db = await database
        const proffys = await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render('study.html', {proffys, subjects, filters, weekdays}) 

    } catch (error) {
        console.log(error)
    }
}

function pageGiveClasses(req, res){
    return res.render("give-classes.html", {subjects, weekdays})
}

async function saveClasses(req, res) {
    const createProffy = require('./database/createProffy')

    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }

    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }

    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from:  convertHoursToMinutes(req.body.time_from[index]),
            time_to:  convertHoursToMinutes(req.body.time_to[index])
        }
    })

    try {
        const db = await database
        await createProffy(db, {proffyValue, classValue, classScheduleValues})

        queryString = {
            subject: req.body.subject,
            weekday: req.body.weekday[0],
            time: req.body.time_from[0]
        }

        console.log("Saindo do saveProffy: " + queryString)
        // queryString = "?subject=" +  req.body.subject
        // queryString += "&weekday=" + req.body.weekday[0]
        // queryString += "&time=" + req.body.time_from[0]

        return res.redirect("/success")    
    } catch (error) {
        console.log(error)
    }
    
    
}

function pageSuccess(req, res){    
    return res.render("success.html")
}

// function toStudy(req, res){
//     const queryString = req.query

//     return req.redirect("/study" + queryString)
// }
module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses,
    pageSuccess
}