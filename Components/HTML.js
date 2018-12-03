import {SafetyPlanDbTables, SkillGroups} from "../Constants/Constants";
import Moment from 'moment'

const rowHtml = (number, name, bold) => {
    const td = bold ? "    <td style='font-weight:bold'>" + number + ". " + name + "</td>\n" : "    <td>" + number + ". "  + name + "</td>\n";

    return  "<tr>\n" +
                td +
            "  </tr>"
};

const tableHtml = (title, items, key) => {
    let rows = '';

    if(title === 'My Network') {
        items.sort(sortContacts).forEach((i, ind) => {
            const bold = i.contactType === 'Professional';
            const name = i.helper ? i[SafetyPlanDbTables[key].dbNameColumn] + " (h)" : i[SafetyPlanDbTables[key].dbNameColumn];

            rows = rows + rowHtml((ind + 1).toString(), name + " - " + i.phone, bold)
        });
    } else {
        items.forEach((i, ind) => rows = rows + rowHtml((ind + 1).toString(), i[SafetyPlanDbTables[key].dbNameColumn], false));
    }
    // bold Professional contacts from 'My Network'

    return  "<table style=\"width:45%; margin-top: 30px\">\n" +
            "  <tr>\n" +
            "    <th>" + title + "</th>\n" +
            "  </tr>\n" +
                rows +
            "</table>";
};

const sortContacts = (contact1, contact2) => {
    if(contact1.contactType > contact2.contactType) {
        return 1;
    } else if(contact1.contactType < contact2.contactType) {
        return -1;
    } else {
        return 0;
    }
};
// keep professional contacts at bottom of table

export const safetyPlanHtml = data => {
    let titles = '';
    Object.keys(data).forEach(s => titles = titles + tableHtml(SafetyPlanDbTables[s].title, data[s], s));

    return  "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <style>\n" +
            "        table, th, td {\n" +
            "            border: 1px solid black;\n" +
            "            border-collapse: collapse;\n" +
            "        }\n" +
            "        th, td {\n" +
            "            padding: 5px;\n" +
            "            text-align: left;\n" +
            "        }\n" +
            "        td {\n" +
            "            font-size: 2vw;\n" +
            "        }\n" +
            "        th {\n" +
            "            font-size: 2vw;\n" +
            "        }\n" +
            "    </style>\n" +
            "</head>\n" +
            "<body>\n" +
            "\n" +
            "<div style=\"display: flex; align-items: center; flex-direction: column;\">\n" +
            "    <h2 style=\"font-size:4vw\">Safety Plan Summary</h2>" +
            "    <p style=\"margin: 0; padding: 0; font-size:3vw\">" + Moment().format('LL') + "</p>\n" +
            "</div>\n" +
            "\n" +
            "<div style=\"display: flex; flex-wrap: wrap; justify-content: space-around\">\n" +
                titles +
            "</div>\n" +
            "\n" +
            "</body>\n" +
            "</html>";
};

const diaryTableRow = (data, result, list) => {
    let rowData = '';
    list.forEach(l => {
        const resArr = result.filter(r => r.diaryDate === data && r.diaryName === l);

        resArr.length > 0 ? rowData = rowData + "<td>" + Math.round(resArr.reduce((acc, res) => {
            return res.rating + acc
        }, 0) / resArr.length) + "</td>\n" : rowData = rowData + "<td>0</td>\n"
        // keeping all ratings as whole numbers i.e. rounding averages
    });

    return  "  <tr>\n" +
            "    <td>" + Moment(data).format("DD/MM") + "</td>\n" +
                rowData +
            "  </tr>\n";
};

const skillTableRow = (dateArr, result, list) => {
    let rowData = '';
    dateArr.forEach(d => {
        const resArr = result.filter(r => r.diaryDate === d && r.diaryName === list.diaryName);

        resArr.length > 0 ? rowData = rowData + "<td>" + (resArr[0].rating ? "✓" : "") + "</td>\n" : rowData = rowData + "<td></td>\n"
    });

    return  "  <tr>\n" +
            "    <td>" + list.diaryName + "</td>\n" +
                rowData +
            "  </tr>\n";
};

export const diaryHtml = (list, result, date) => {
    let dateArray = [];
    const selectedDate = Moment(date).format("YYYY-MM-DD");
    let weekAgo = Moment(date).subtract(6,'d').format('YYYY-MM-DD');

    while (selectedDate >= weekAgo) {
        dateArray.push(Moment(weekAgo).format("YYYY-MM-DD"));
        weekAgo = Moment(weekAgo).add(1, 'd').format("YYYY-MM-DD");
    }

    const feelingList = list.filter(l => l.diaryType === 'Feeling');
    const feelingResult = result.filter(r => r.diaryType === 'Feeling');

    const skillList = list.filter(l => l.diaryType === 'Skill');
    const skillResult = result.filter(r => r.diaryType === 'Skill');

    let skillRows = '';

    Object.keys(SkillGroups).forEach(gr => {
        skillRows = skillRows + "  <tr>\n" +
                                "    <th colspan='8'>" + SkillGroups[gr] + "</th>\n" +
                                "  </tr>\n";

        skillList.filter(li => li.subType.toString() === gr).forEach(sk => {
            skillRows = skillRows + skillTableRow(dateArray, skillResult.map(res => ({...res, diaryDate: Moment(res.diaryDate).format("YYYY-MM-DD")})).filter(skill => skill.diaryName === sk.diaryName), sk)
        });
    });

    let diaryRows = '';
    let skillHeaders = '';
    dateArray.forEach(d => {
        diaryRows = diaryRows + diaryTableRow(d, feelingResult.map(res => ({...res, diaryDate: Moment(res.diaryDate).format("YYYY-MM-DD")})), feelingList.map(l => l.diaryName));

        skillHeaders = skillHeaders + "    <th>" + Moment(d).format("DD/MM") + "</th>\n";
    });

    let diaryScales = '';
    let diaryHeaders = '';
    feelingList.forEach(l => {
        diaryHeaders = diaryHeaders + "    <th>" + l.diaryName + "</th>\n";
        diaryScales = diaryScales + "    <td>" + l.minRating + "-" + l.scale + "</td>\n"
    });

    return  "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        "   <meta name='viewport' content='width=device-width, initial-scale=.8'>\n" +
        "    <style>\n" +
        "        table, th, td {\n" +
        "            border: 1px solid black;\n" +
        "            border-collapse: collapse;\n" +
        "        }\n" +
        "        th, td {\n" +
        "            padding: 5px;\n" +
        "            text-align: center;\n" +
        "        }\n" +
        "        td {\n" +
        "            font-size: 2vw;\n" +
        "        }\n" +
        "        th {\n" +
        "            font-size: 2vw;\n" +
        "        }\n" +
        "        table {\n" +
        "            page-break-inside: auto;\n" +
        "        }\n" +
        "        tr {\n" +
        "            page-break-inside: avoid;\n" +
        "        }\n" +
        "        thead {\n" +
        "            display: table-header-group;\n" +
        "        }\n" +
        "        tfoot {\n" +
        "            display: table-footer-group;\n" +
        "        }\n" +
        "    </style>\n" +
        "</head>\n" +
        "<body>\n" +
        "\n" +
        "<div style=\"display: flex; align-items: center; flex-direction: column;\">\n" +
        "    <h2 style=\"font-size:4vw\">DBT Diary Card</h2>" +
        "    <p style=\"margin: 0; padding: 0; font-size:3vw\">" + Moment(date).format('LL') + "</p>\n" +
        "</div>\n" +
        "\n" +
        "<div style=\"display: flex; justify-content: center\">\n" +
            "<table style=\"width:95%; margin-top: 30px\">\n" +
            "  <thead>\n" +
            "  <tr>\n" +
            "    <th></th>\n" +
            diaryHeaders +
            "  </tr>\n" +
            "  </thead>\n" +
            "  <tbody>\n" +
            "  <tr>\n" +
            "    <td></td>\n" +
            diaryScales +
            "  </tr>\n" +
            diaryRows +
            "  </tbody>\n" +
            "</table>" +
        "</div>\n" +
        "<div style=\"display: flex; margin-top: 10px; margin-bottom: 10px; justify-content: center\">\n" +
            "<table style=\"width:95%; margin-top: 30px\">\n" +
            "  <thead>\n" +
            "  <tr>\n" +
            "    <th></th>\n" +
            skillHeaders +
            "  </tr>\n" +
            "  </thead>\n" +
            skillRows +
            "</table>" +
        "</div>\n" +
        "\n" +
        "</body>\n" +
        "</html>";
};

