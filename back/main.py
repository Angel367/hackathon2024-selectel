from telebot import types
import telebot

bot = telebot.TeleBot('6973167122:AAGzL7wlBqxp6ocVt5HwpR_bSxKmKgt-Y4Q')

main_url = "https://donorsearchorg.ru/"


buttons = [
    {
        "text": "Главная страница",
        "url": main_url
    },
    {
        "text": "Журнал",
        "url": main_url + "journal"
    },
    {
        "text": "Где сдать кровь",
        "url": main_url + "bloodstations"
    },
    {
        "text": "Пожертвовать проекту",
        "url": main_url + "donate"
    },
    {
        "text": "text",
        "url": "https://donor-frontend.vercel.app/"
    }
]


def create_button(text, url):
    web_app_test = types.WebAppInfo(url)  # создаем webappinfo - формат хранения url
    one_butt = types.KeyboardButton(text=text, web_app=web_app_test)  # создаем кнопку типа webapp
    return one_butt


def web_app_keyboard():  # создание клавиатуры с webapp кнопкой
    keyboard = types.ReplyKeyboardMarkup(row_width=2)  # создаем клавиатуру
    for button in buttons:
        keyboard.add(create_button(button["text"], button["url"]))
    return keyboard  # возвращаем клавиатуру


def web_app_keyboard_inline():  # создание inline-клавиатуры с webapp кнопкой
    keyboard = types.InlineKeyboardMarkup(row_width=2)  # создаем клавиатуру inline
    web_app = types.WebAppInfo(main_url)  # создаем webappinfo - формат хранения url
    one = types.InlineKeyboardButton(text="Веб приложение", web_app=web_app)  # создаем кнопку типа webapp
    keyboard.add(one)  # добавляем кнопку в клавиатуру

    return keyboard  # возвращаем клавиатуру


@bot.message_handler(commands=['start'])  # обрабатываем команду старт
def start_fun(message):
    bot.send_message(message.chat.id,
                     'Привет, я бот для проверки телеграмм webapps!)\nЗапустить тестовые страницы можно нажав на '
                     'кнопки.',
                     parse_mode="Markdown", reply_markup=web_app_keyboard())  # отправляем сообщение с нужной клавиатурой


@bot.message_handler(content_types="text")
def new_mes(message):
    start_fun(message)


@bot.message_handler(content_types="web_app_data")  # получаем отправленные данные
def answer(web_app_mes):
    print(web_app_mes)  # вся информация о сообщении
    print(web_app_mes.web_app_data.data)  # конкретно то что мы передали в бота
    bot.send_message(web_app_mes.chat.id, f"получили инофрмацию из веб-приложения: {web_app_mes.web_app_data.data}")
    # отправляем сообщение в ответ на отправку данных из веб-приложения


if __name__ == '__main__':
    bot.infinity_polling()
