import { SafetyPlanDbTables } from '../../Constants/Constants';
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
    '            font-size: 25px;\n' +
    '        }\n' +
    '        th {\n' +
    '            font-size: 30px;\n' +
    '        }\n' +
    '    </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '\n' +
    '<div style="display: flex; align-items: center; flex-direction: column;">\n' +
    '    <h1>Safety Plan Summary</h1>' +
    '    <p style="margin: 0; padding: 0; font-size: 30px">' +
    Moment().format('LL') +
    '</p>\n' +
    '</div>\n' +
    '\n' +
    '<div style="display: flex; flex-wrap: wrap; justify-content: space-around; margin-top: 30px">\n' +
    titles +
    '</div>\n' +
    '\n' +
    '</body>\n' +
    '</html>'
  );
};

export const diaryHtml = '';
