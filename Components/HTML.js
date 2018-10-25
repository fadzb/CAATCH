import { SafetyPlanDbTables } from '../Constants/Constants';
import Moment from 'moment';

const rowHtml = (name) => {
  return '<tr>\n' + '    <td>' + name + '</td>\n' + '  </tr>';
};

const tableHtml = (title, items, key) => {
  let rows = '';
  items.forEach((i) => (rows = rows + rowHtml(i[SafetyPlanDbTables[key].dbNameColumn])));

  return (
    '<table style="width:45%; margin-top: 70px">\n' +
    '  <tr>\n' +
    '    <th>' +
    title +
    '</th>\n' +
    '  </tr>\n' +
    rows +
    '</table>'
  );
};

export const safetyPlanHtml = (data) => {
  let titles = '';
  Object.keys(data).forEach((s) => (titles = titles + tableHtml(SafetyPlanDbTables[s].title, data[s], s)));

  return (
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head>\n' +
    '    <style>\n' +
    '        table, th, td {\n' +
    '            border: 1px solid black;\n' +
    '            border-collapse: collapse;\n' +
    '        }\n' +
    '        th, td {\n' +
    '            padding: 5px;\n' +
    '            text-align: center;\n' +
    '        }\n' +
    '        td {\n' +
    '            font-size: 18px;\n' +
    '        }\n' +
    '        th {\n' +
    '            font-size: 20px;\n' +
    '        }\n' +
    '    </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '\n' +
    '<div style="display: flex; align-items: center; flex-direction: column;">\n' +
    '    <h2>Safety Plan Summary</h2>' +
    '    <p style="margin: 0; padding: 0; font-size: 20px">' +
    Moment().format('LL') +
    '</p>\n' +
    '</div>\n' +
    '\n' +
    '<div style="display: flex; flex-wrap: wrap; justify-content: space-around">\n' +
    titles +
    '</div>\n' +
    '\n' +
    '</body>\n' +
    '</html>'
  );
};

const diaryTableRow = (data, result, list) => {
  let rowData = '';
  list.forEach((l) => {
    const resArr = result.filter((r) => r.diaryDate === data && r.diaryName === l);

    resArr.length > 0
      ? (rowData =
          rowData +
          '<td>' +
          resArr.reduce((acc, res) => {
            return res.rating + acc;
          }, 0) /
            resArr.length +
          '</td>\n')
      : (rowData = rowData + '<td>0</td>\n');
  });

  return '  <tr>\n' + '    <td>' + Moment(data).format('DD/MM') + '</td>\n' + rowData + '  </tr>\n';
};

const skillTableRow = (dateArr, result, list) => {
  let rowData = '';
  dateArr.forEach((d) => {
    const resArr = result.filter((r) => r.diaryDate === d && r.diaryName === list.diaryName);

    resArr.length > 0
      ? (rowData = rowData + '<td>' + (resArr[0].rating ? '✓' : '') + '</td>\n')
      : (rowData = rowData + '<td></td>\n');
  });

  return '  <tr>\n' + '    <td>' + list.diaryName + '</td>\n' + rowData + '  </tr>\n';
};

export const diaryHtml = (list, result) => {
  let dateArray = [];
  const today = Moment().format('YYYY-MM-DD');
  let weekAgo = Moment().subtract(6, 'd').format('YYYY-MM-DD');

  while (today >= weekAgo) {
    dateArray.push(Moment(weekAgo).format('YYYY-MM-DD'));
    weekAgo = Moment(weekAgo).add(1, 'd').format('YYYY-MM-DD');
  }

  const feelingList = list.filter((l) => l.diaryType === 'Feeling');
  const feelingResult = result.filter((r) => r.diaryType === 'Feeling');

  const skillList = list.filter((l) => l.diaryType === 'Skill');
  const skillResult = result.filter((r) => r.diaryType === 'Skill');

  let skillRows = '';

  skillList.forEach((sk) => {
    skillRows =
      skillRows +
      skillTableRow(
        dateArray,
        skillResult
          .map((res) => ({ ...res, diaryDate: Moment(res.diaryDate).format('YYYY-MM-DD') }))
          .filter((skill) => skill.diaryName === sk.diaryName),
        sk
      );
  });

  let diaryRows = '';
  let skillHeaders = '';
  dateArray.forEach((d) => {
    diaryRows =
      diaryRows +
      diaryTableRow(
        d,
        feelingResult.map((res) => ({ ...res, diaryDate: Moment(res.diaryDate).format('YYYY-MM-DD') })),
        feelingList.map((l) => l.diaryName)
      );

    skillHeaders = skillHeaders + '    <th>' + Moment(d).format('DD/MM') + '</th>\n';
  });

  let diaryScales = '';
  let diaryHeaders = '';
  feelingList.forEach((l) => {
    diaryHeaders = diaryHeaders + '    <th>' + l.diaryName + '</th>\n';
    diaryScales = diaryScales + '    <td>' + l.minRating + '-' + l.scale + '</td>\n';
  });

  return (
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head>\n' +
    '    <style>\n' +
    '        table, th, td {\n' +
    '            border: 1px solid black;\n' +
    '            border-collapse: collapse;\n' +
    '        }\n' +
    '        th, td {\n' +
    '            padding: 5px;\n' +
    '            text-align: center;\n' +
    '        }\n' +
    '        td {\n' +
    '            font-size: 18px;\n' +
    '        }\n' +
    '        th {\n' +
    '            font-size: 20px;\n' +
    '        }\n' +
    '    </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '\n' +
    '<div style="display: flex; align-items: center; flex-direction: column;">\n' +
    '    <h2>DBT Diary Card</h2>' +
    '    <p style="margin: 0; padding: 0; font-size: 20px">' +
    Moment().format('LL') +
    '</p>\n' +
    '</div>\n' +
    '\n' +
    '<div style="display: flex; margin-bottom: 10px; justify-content: center">\n' +
    '<table style="width:95%; margin-top: 70px">\n' +
    '  <tr>\n' +
    '    <th></th>\n' +
    diaryHeaders +
    '  </tr>\n' +
    '  <tr>\n' +
    '    <td></td>\n' +
    diaryScales +
    '  </tr>\n' +
    diaryRows +
    '</table>' +
    '</div>\n' +
    '<div style="display: flex; margin-top: 10px; margin-bottom: 10px; justify-content: center">\n' +
    '<table style="width:95%; margin-top: 70px">\n' +
    '  <tr>\n' +
    '    <th></th>\n' +
    skillHeaders +
    '  </tr>\n' +
    skillRows +
    '</table>' +
    '</div>\n' +
    '\n' +
    '</body>\n' +
    '</html>'
  );
};
