"use client";

import { useMemo, useState } from "react";

type KidsStory = {
  id: string;
  title: string;
  testament: "OT" | "NT";
  book: string;
  summary: string;
  verse: string;
  activity: string;
  emoji: string;
  image?: string;
  ref: string;
};

const stories: KidsStory[] = [
  // ── OLD TESTAMENT ─────────────────────────────────────────────────────────
  {
    id: "creation",
    title: "God Made the World",
    testament: "OT",
    book: "Genesis",
    summary:
      "In the very beginning there was nothing — then God spoke and everything came to be! He made light, the sky, the oceans, plants, the sun, the moon, the stars, every animal, and finally people. God looked at everything He made and said it was very good. Whenever you see something beautiful outside, remember — God made it, and He made you too!",
    verse: 'Genesis 1:1 — "In the beginning God created the heavens and the earth."',
    activity:
      "Go outside and find 3 amazing things God made. Draw them and write why each one is wonderful.",
    emoji: "🌍",
    image: "/kids-creation.svg",
    ref: "Genesis 1:1–5",
  },
  {
    id: "adam-eve",
    title: "Adam and Eve",
    testament: "OT",
    book: "Genesis",
    summary:
      "God made a beautiful garden called Eden and put the first man Adam and the first woman Eve there. Everything was perfect! God gave them one rule — don't eat from one special tree. But a sneaky snake told Eve to eat the fruit, and she and Adam disobeyed God. They had to leave the garden. But even then, God still loved them and made a plan to fix everything.",
    verse:
      'Genesis 3:9 — "God called out to the man, \'Where are you?\'"',
    activity:
      "Draw the Garden of Eden with colorful fruits and flowers. Talk about a time you said sorry to someone you love.",
    emoji: "🌿",
    ref: "Genesis 2–3",
  },
  {
    id: "noah",
    title: "Noah's Ark",
    testament: "OT",
    book: "Genesis",
    summary:
      "God asked Noah to build a big boat called an ark. Noah obeyed God even when it was really hard. God sent rain for 40 days and nights, and Noah, his family, and all the animals were safe inside. When the rain stopped, God put a rainbow in the sky as a promise that He would always love us and never flood the whole earth again.",
    verse: 'Genesis 6:22 — "Noah did everything just as God commanded him."',
    activity:
      "Draw a colorful rainbow and write 3 promises you know God keeps.",
    emoji: "🌈",
    image: "/kids-ark.svg",
    ref: "Genesis 6:9–22",
  },
  {
    id: "tower-babel",
    title: "The Tower of Babel",
    testament: "OT",
    book: "Genesis",
    summary:
      "Long ago, everyone in the world spoke the same language. The people decided to build a huge tower all the way to the sky — not to praise God, but to show off how great they were. God saw their pride and mixed up their languages so they couldn't understand each other anymore. The people spread out all over the earth. That's why there are so many languages in the world today!",
    verse:
      'Genesis 11:4 — "Come, let us build a city with a tower that reaches to the heavens."',
    activity:
      "Try to say 'Hello' in 3 different languages. Thank God for all the different people and cultures in the world.",
    emoji: "🏗️",
    ref: "Genesis 11:1–9",
  },
  {
    id: "abraham",
    title: "Abraham Trusts God",
    testament: "OT",
    book: "Genesis",
    summary:
      "God told an old man named Abraham to leave his home and travel to a new land — and Abraham went, even though he didn't know exactly where he was going! God promised Abraham he would have more descendants than the stars in the sky. Abraham and his wife Sarah were very old, but God kept His promise and gave them a son named Isaac. God always keeps His promises!",
    verse:
      'Genesis 15:6 — "Abram believed God, and he credited it to him as righteousness."',
    activity:
      "On a clear night, look up and count as many stars as you can. Thank God for His promises to you.",
    emoji: "⭐",
    ref: "Genesis 12:1–4; 15:5–6",
  },
  {
    id: "joseph",
    title: "Joseph's Colorful Coat",
    testament: "OT",
    book: "Genesis",
    summary:
      "Joseph's father gave him a beautiful coat of many colors. His brothers were jealous and did mean things to him. Joseph had many hard days, but he never stopped trusting God. God gave Joseph special dreams and helped him understand other people's dreams too. In the end, God used everything — even the painful parts — to help Joseph save many lives, including his whole family.",
    verse:
      'Genesis 50:20 — "You intended to harm me, but God intended it for good."',
    activity:
      "Color a coat with as many colors as you can. Write the name of someone you will be extra kind to today.",
    emoji: "🎨",
    image: "/kids-coat.svg",
    ref: "Genesis 37:3",
  },
  {
    id: "baby-moses",
    title: "Baby Moses in a Basket",
    testament: "OT",
    book: "Exodus",
    summary:
      "The king of Egypt was afraid of the Israelite babies, so he gave a terrible order. Moses's brave mother made a little basket-boat and hid baby Moses in the reeds by the river. The king's own daughter found Moses and took him home to raise him. God protected baby Moses and had a big plan for his life. God watches over each of us from the very beginning!",
    verse:
      'Exodus 2:2 — "She saw that he was a fine child, and she hid him for three months."',
    activity:
      "Make a little boat out of paper. Float it in a sink or tub and thank God for protecting you.",
    emoji: "🧺",
    ref: "Exodus 2:1–10",
  },
  {
    id: "burning-bush",
    title: "Moses and the Burning Bush",
    testament: "OT",
    book: "Exodus",
    summary:
      "Moses was watching sheep when he saw something incredible — a bush on fire that was not burning up! God spoke from the bush and called Moses by name. God gave Moses an important job: go free God's people from Egypt. Even when Moses felt scared and not good enough, God said 'I will be with you.' God calls each of us for special things too, and He always goes with us.",
    verse:
      'Exodus 3:4 — "God called to him from within the bush, \'Moses! Moses!\'"',
    activity:
      "With a grown-up, light a candle. Watch the flame and talk about how God speaks to you.",
    emoji: "🔥",
    image: "/kids-fire.svg",
    ref: "Exodus 3:1–14",
  },
  {
    id: "plagues",
    title: "God Sends the Plagues",
    testament: "OT",
    book: "Exodus",
    summary:
      "Pharaoh, the king of Egypt, refused to let God's people go. So God sent 10 amazing signs called plagues to show how powerful He is — things like frogs everywhere, darkness, and more. Each time, Pharaoh hardened his heart and said no. Finally, after the last plague, Pharaoh told the Israelites to leave. Nothing can stop God from keeping His promises!",
    verse:
      'Exodus 9:16 — "I raised you up for this very purpose, that I might show you my power."',
    activity:
      "Draw and count all 10 plagues. Talk about a time God helped your family through something hard.",
    emoji: "🐸",
    ref: "Exodus 7–11",
  },
  {
    id: "red-sea",
    title: "Moses Parts the Red Sea",
    testament: "OT",
    book: "Exodus",
    summary:
      "Moses led God's people out of Egypt, but they reached the Red Sea with no way across and the Egyptian army was chasing them! The people were very scared. God told Moses to stretch out his hand — and God parted the water to make a dry path right through the sea! Everyone walked through safely. Then the waters came back and stopped the army. Nothing is too hard for God!",
    verse:
      'Exodus 14:21 — "The Lord drove the sea back by a strong east wind."',
    activity:
      "Fill a bowl with water and move your hand through it. Thank God for making a way when things seem impossible.",
    emoji: "🌊",
    image: "/kids-waves.svg",
    ref: "Exodus 14:21–22",
  },
  {
    id: "manna",
    title: "Manna from Heaven",
    testament: "OT",
    book: "Exodus",
    summary:
      "After the Israelites crossed the Red Sea, they were hungry in the desert. They were worried there was nothing to eat. But every single morning God sent special food called manna — like sweet thin flakes — right from the sky! And in the evening He sent quail to eat. God provided food every single day. God knows what you need and He will always provide.",
    verse:
      'Exodus 16:4 — "I will rain down bread from heaven for you."',
    activity:
      "Before every meal this week, say a thank-you prayer to God for your food.",
    emoji: "🍞",
    ref: "Exodus 16:1–18",
  },
  {
    id: "ten-commandments",
    title: "The Ten Commandments",
    testament: "OT",
    book: "Exodus",
    summary:
      "God called Moses up a big mountain called Sinai. God gave Moses 10 rules called the Ten Commandments, written on stone tablets. These rules help us love God and love each other — things like honor your parents, be honest, and rest on the Sabbath. God gave us these rules because He loves us and wants us to live good, happy lives.",
    verse:
      'Exodus 20:3 — "You shall have no other gods before me."',
    activity:
      "Try to memorize all 10 commandments. Write each one and draw a picture for it.",
    emoji: "📜",
    ref: "Exodus 20:1–17",
  },
  {
    id: "jericho",
    title: "Joshua and the Walls of Jericho",
    testament: "OT",
    book: "Joshua",
    summary:
      "God led His people to a new land, but the city of Jericho had tall, thick walls. God had a surprising plan — He told the Israelites to march around the city once a day for 6 days, and on the 7th day march around 7 times, then SHOUT! When they obeyed and shouted, the walls fell down flat! God's plans don't always look like what we expect, but they always work!",
    verse:
      'Joshua 1:9 — "Be strong and courageous. Do not be afraid... for the Lord your God will be with you."',
    activity:
      "March around your house 7 times, then shout! Talk about how God wants us to trust His plans even when they seem unusual.",
    emoji: "🎺",
    ref: "Joshua 6:1–20",
  },
  {
    id: "ruth",
    title: "Ruth's Kindness",
    testament: "OT",
    book: "Ruth",
    summary:
      "Ruth's husband died and she was far from her homeland. Her mother-in-law Naomi was also sad and alone. Ruth could have gone back to her own family, but instead she stayed with Naomi and said the most beautiful words: 'Where you go I will go.' Ruth worked hard to take care of Naomi. God blessed Ruth's kindness and she found a wonderful new family. Loyalty and kindness always honor God.",
    verse:
      'Ruth 1:16 — "Where you go I will go, and where you stay I will stay."',
    activity:
      "Write a note of kindness to someone who might be lonely. Deliver it today!",
    emoji: "🌾",
    ref: "Ruth 1–4",
  },
  {
    id: "samuel",
    title: "Samuel Hears God's Voice",
    testament: "OT",
    book: "1 Samuel",
    summary:
      "Samuel was a little boy who lived in God's temple and helped the priest Eli. One night Samuel heard a voice calling his name. He ran to Eli three times thinking Eli called him — but Eli didn't! Finally Eli realized it was God calling. He told Samuel: 'Next time say, Speak Lord, your servant is listening.' God loves to speak to people — even children. Are you listening for God's voice?",
    verse:
      '1 Samuel 3:10 — "Speak, for your servant is listening."',
    activity:
      "Sit quietly for 2 minutes. Ask God to speak to your heart. Write or draw what comes to mind.",
    emoji: "👂",
    ref: "1 Samuel 3:1–10",
  },
  {
    id: "david",
    title: "David and Goliath",
    testament: "OT",
    book: "1 Samuel",
    summary:
      "A giant named Goliath scared everyone — except a young shepherd boy named David. David trusted God and was not afraid. He picked up a small smooth stone, used his sling, and with God's help the giant fell down with just one stone! God can help us be brave even when things feel really big and scary. You don't have to be big and strong — you just need to trust God.",
    verse:
      '1 Samuel 17:45 — "I come to you in the name of the Lord of Hosts."',
    activity:
      "Find 5 stones outside. On paper, write something scary you are trusting God with.",
    emoji: "🪨",
    image: "/kids-david.svg",
    ref: "1 Samuel 17:45–50",
  },
  {
    id: "solomon",
    title: "Solomon's Wisdom",
    testament: "OT",
    book: "1 Kings",
    summary:
      "When Solomon became the new king of Israel, God appeared to him and said: 'Ask for anything you want!' Instead of asking for money or power, Solomon asked for wisdom to lead God's people well. God was so pleased! He gave Solomon great wisdom AND riches too. When we put others first and ask for what is truly good, God blesses us even more than we could imagine.",
    verse:
      '1 Kings 3:9 — "So give your servant a discerning heart to govern your people."',
    activity:
      "Ask a parent or grandparent for their wisest piece of advice. Write it down and memorize it.",
    emoji: "👑",
    ref: "1 Kings 3:5–14",
  },
  {
    id: "elijah",
    title: "Elijah and the Fire from Heaven",
    testament: "OT",
    book: "1 Kings",
    summary:
      "The people of Israel started worshipping fake gods called Baal. God's prophet Elijah challenged the Baal prophets to a contest on Mount Carmel — each side would pray and the true God would send fire from heaven to burn the sacrifice. Baal's prophets prayed all day and nothing happened. Then Elijah prayed ONE simple prayer to God — and fire came roaring down! Everyone fell down and said, 'The Lord, He is God!'",
    verse:
      '1 Kings 18:39 — "The Lord, he is God! The Lord, he is God!"',
    activity:
      "Draw fire coming from the sky. Thank God that He is the one true God and He hears your prayers.",
    emoji: "⚡",
    ref: "1 Kings 18:20–39",
  },
  {
    id: "esther",
    title: "Esther Saves Her People",
    testament: "OT",
    book: "Esther",
    summary:
      "Esther was a young Jewish woman who became queen of Persia. A wicked man named Haman made a plan to hurt all the Jewish people. Esther's uncle Mordecai told her she needed to speak up — maybe she had become queen for exactly this moment! Esther was scared, but she was brave. She went to the king, spoke up, and saved her whole people. God places us exactly where we need to be!",
    verse:
      'Esther 4:14 — "Who knows? Perhaps you were made queen for just such a time as this."',
    activity:
      "Think of a time you need to be brave and speak up for someone. Write a prayer asking God for courage like Esther.",
    emoji: "👸",
    ref: "Esther 4–7",
  },
  {
    id: "daniel-furnace",
    title: "The Fiery Furnace",
    testament: "OT",
    book: "Daniel",
    summary:
      "King Nebuchadnezzar made a huge gold statue and ordered everyone to bow down to it. Three of Daniel's friends — Shadrach, Meshach, and Abednego — refused because they only worshipped God. The angry king threw them into a furnace so hot it hurt the soldiers who threw them in. But inside the fire, the king saw FOUR people walking around unhurt! God had sent an angel to protect them. They came out without even the smell of smoke on them!",
    verse:
      'Daniel 3:25 — "I see four men walking around in the fire, unharmed!"',
    activity:
      "Write the names Shadrach, Meshach, and Abednego on your fingers. Practice saying them! Talk about standing up for what is right.",
    emoji: "🔥",
    ref: "Daniel 3:1–28",
  },
  {
    id: "daniel",
    title: "Daniel and the Lions",
    testament: "OT",
    book: "Daniel",
    summary:
      "Daniel loved God and prayed every single day, three times a day. Some jealous men made a law that no one could pray to anyone but the king. Daniel heard the new law but kept praying anyway! He was thrown into a den of hungry lions. But God sent an angel to shut the lions' mouths. Daniel was not hurt at all. In the morning the king was so happy and amazed — he told everyone to respect Daniel's God!",
    verse:
      'Daniel 6:22 — "My God sent his angel and shut the lions\' mouths."',
    activity:
      "Draw Daniel safe in the lion's den with the angel. Write a thank-you prayer to God for protecting you.",
    emoji: "🦁",
    image: "/kids-lion.svg",
    ref: "Daniel 6:16–23",
  },
  {
    id: "jonah",
    title: "Jonah and the Big Fish",
    testament: "OT",
    book: "Jonah",
    summary:
      "God asked Jonah to go help a city called Nineveh, but Jonah ran away on a boat. A big storm came, and Jonah was swallowed by a giant fish! Inside the fish, Jonah prayed and said sorry to God. After three days, the fish spit Jonah out onto the beach. Jonah obeyed God, went to Nineveh, and the whole city turned back to God! It is never too late to say sorry and do the right thing.",
    verse:
      'Jonah 2:1 — "Then Jonah prayed to the Lord his God from inside the fish."',
    activity:
      "Draw a huge fish with Jonah inside. Write one thing you will choose to obey God in this week.",
    emoji: "🐋",
    image: "/kids-whale.svg",
    ref: "Jonah 1:17",
  },

  // ── NEW TESTAMENT ──────────────────────────────────────────────────────────
  {
    id: "angel-mary",
    title: "The Angel Visits Mary",
    testament: "NT",
    book: "Luke",
    summary:
      "A young woman named Mary was going about her ordinary day when an angel named Gabriel suddenly appeared! The angel told Mary something amazing — she would have a very special baby, God's own Son, and His name would be Jesus. Mary was surprised and a little scared, but she trusted God and said yes. God chose an ordinary, faithful young woman for the most extraordinary job ever!",
    verse:
      'Luke 1:38 — "I am the Lord\'s servant. May your word to me be fulfilled."',
    activity:
      "Draw an angel with bright wings. Write one way you will say 'yes' to God this week.",
    emoji: "👼",
    ref: "Luke 1:26–38",
  },
  {
    id: "jesus-birth",
    title: "Baby Jesus Is Born",
    testament: "NT",
    book: "Luke",
    summary:
      "God sent His Son Jesus to earth as a tiny baby! Mary and Joseph traveled a long way to Bethlehem, but every inn was full. Jesus was born in a simple stable with the animals. Angels lit up the sky and sang to shepherds in the fields: 'Good news! A Savior is born!' The shepherds ran to see baby Jesus. Wise men followed a star for miles and brought Him gifts. It was the most special birthday in all of history!",
    verse:
      'Luke 2:11 — "A Savior has been born to you; he is the Messiah, the Lord."',
    activity:
      "Make a paper star and hang it up to remember that Jesus came for everyone!",
    emoji: "⭐",
    image: "/kids-star.svg",
    ref: "Luke 2:1–14",
  },
  {
    id: "wise-men",
    title: "Wise Men Follow the Star",
    testament: "NT",
    book: "Matthew",
    summary:
      "Far away in the east, some very wise scholars saw a special new star in the sky. They knew it meant a great king had been born. They packed up and traveled a very long way, following the star for months! When they found baby Jesus they were filled with joy. They bowed down and gave Him gifts of gold, frankincense, and myrrh. These wise men show us that it is worth traveling far and giving our best to Jesus!",
    verse:
      'Matthew 2:11 — "They bowed down and worshipped him... they presented him with gifts."',
    activity:
      "Look up what gold, frankincense, and myrrh are. What gift would you give Jesus today?",
    emoji: "🌟",
    ref: "Matthew 2:1–12",
  },
  {
    id: "baptism",
    title: "Jesus Is Baptized",
    testament: "NT",
    book: "Matthew",
    summary:
      "Jesus came to a man named John who was baptizing people in the Jordan River. Even though Jesus had done nothing wrong, He wanted to be baptized to show us the way. When Jesus came out of the water, the sky opened up! A dove came down from heaven, and God's voice said: 'This is my beloved Son — I am so pleased with Him!' God was proud of Jesus. God is proud when we follow Jesus too.",
    verse:
      'Matthew 3:17 — "This is my Son, whom I love; with him I am well pleased."',
    activity:
      "Draw a dove and a river. Write 3 things that make you want to follow Jesus.",
    emoji: "🕊️",
    ref: "Matthew 3:13–17",
  },
  {
    id: "disciples",
    title: "Jesus Calls His Disciples",
    testament: "NT",
    book: "Mark",
    summary:
      "Jesus was walking by the Sea of Galilee when He saw some fishermen — brothers Simon and Andrew — throwing their nets. He called out: 'Follow me, and I will make you fishers of people!' They left their nets right away and followed Him. Jesus called 12 disciples altogether — ordinary people like fishermen and tax collectors. Jesus chose regular people, and He chooses us too!",
    verse:
      'Mark 1:17 — "Come, follow me, and I will send you out to fish for people."',
    activity:
      "Write the names of Jesus's 12 disciples. Circle the ones you know stories about.",
    emoji: "🎣",
    ref: "Mark 1:16–20",
  },
  {
    id: "lords-prayer",
    title: "The Lord's Prayer",
    testament: "NT",
    book: "Matthew",
    summary:
      "The disciples asked Jesus how to pray. Jesus taught them a perfect prayer — we call it the Lord's Prayer. It starts by praising God and asking for His kingdom to come, then asks for daily bread, forgiveness, and protection from evil. This prayer shows us that we can talk to God about everything: what we need, how we feel, and how to forgive others. Prayer is simply talking to God like a friend.",
    verse:
      'Matthew 6:9 — "Our Father in heaven, hallowed be your name."',
    activity:
      "Learn the Lord's Prayer by heart. Say it with your family tonight.",
    emoji: "🙏",
    ref: "Matthew 6:9–13",
  },
  {
    id: "storm",
    title: "Jesus Calms the Storm",
    testament: "NT",
    book: "Mark",
    summary:
      "Jesus and His disciples were crossing a lake in a boat when a wild storm hit. Giant waves crashed over the boat — the disciples were terrified! Jesus was asleep in the back of the boat. They woke Him up shouting, 'Don't you care that we're about to sink?' Jesus stood up and said to the storm: 'Peace! Be still!' The wind stopped. The sea went calm. Even the wind and waves obey Jesus!",
    verse:
      'Mark 4:39 — "Quiet! Be still! And the wind died down and it was completely calm."',
    activity:
      "Make wave sounds with a bowl of water, then still it with your hand. Remember Jesus has power over every storm in your life.",
    emoji: "⛵",
    ref: "Mark 4:35–41",
  },
  {
    id: "good-samaritan",
    title: "The Good Samaritan",
    testament: "NT",
    book: "Luke",
    summary:
      "Jesus told a story about a man who was robbed and left hurt on the road. Several important people walked right past and did not help. But then a Samaritan — someone from a different group that Jews often disliked — stopped, helped clean the man's wounds, put him on his donkey, and paid for him to stay at an inn. Jesus asked: 'Who was a neighbor?' Being kind doesn't ask if someone is like you first.",
    verse:
      'Luke 10:36–37 — "Which of these was a neighbor to the man?... The one who had mercy."',
    activity:
      "Do one kind thing for someone this week who doesn't expect it. Write about what happened.",
    emoji: "🤝",
    ref: "Luke 10:30–37",
  },
  {
    id: "prodigal",
    title: "The Prodigal Son",
    testament: "NT",
    book: "Luke",
    summary:
      "Jesus told a story about a son who asked his father for his inheritance and ran away to live wildly. He wasted all his money, ended up starving and feeding pigs. He decided to go home and say sorry. While he was still far away, his father saw him coming and RAN to him! He hugged his son and threw a big party. This is just like God — He is always watching for us, ready to run and welcome us home.",
    verse:
      'Luke 15:20 — "While he was still a long way off, his father saw him and ran to him."',
    activity:
      "Draw the father running to meet his son. Thank God that He always welcomes you back, no matter what.",
    emoji: "🏠",
    ref: "Luke 15:11–32",
  },
  {
    id: "loaves",
    title: "Jesus Feeds 5,000 People",
    testament: "NT",
    book: "John",
    summary:
      "A huge crowd was hungry and there was almost no food. A small boy shared his lunch — just 5 loaves of bread and 2 fish. Jesus took the food, said thank you to God, and gave it out. Amazingly, everyone ate until they were completely full! There were even 12 baskets of leftovers! When we share what we have, even if it seems very little, God can do miraculous things with it.",
    verse:
      'John 6:11 — "Jesus gave thanks and distributed the food to those who were seated."',
    activity:
      "Pack a snack to share with a friend. Talk about how sharing shows God's love.",
    emoji: "🐟",
    image: "/kids-loaves.svg",
    ref: "John 6:1–13",
  },
  {
    id: "walk-water",
    title: "Jesus Walks on Water",
    testament: "NT",
    book: "Matthew",
    summary:
      "The disciples were in a boat at night when they saw someone walking toward them on the water — it was Jesus! Peter called out: 'If it's you, tell me to come!' Jesus said, 'Come!' Peter climbed out of the boat and started walking on water! But when he looked at the big waves he got scared and started to sink. Jesus reached out and caught him. When we keep our eyes on Jesus, we can do impossible things!",
    verse:
      'Matthew 14:29–30 — "Come," [Jesus] said. Then Peter got down out of the boat and walked on water.',
    activity:
      "Draw Peter walking on the water with Jesus holding his hand. Write one thing you will trust Jesus with this week.",
    emoji: "🌊",
    ref: "Matthew 14:25–31",
  },
  {
    id: "zacchaeus",
    title: "Zacchaeus in the Tree",
    testament: "NT",
    book: "Luke",
    summary:
      "Zacchaeus was a short man who really wanted to see Jesus, but the crowd was in the way. So he climbed up a sycamore tree! Jesus looked up, saw him, and called out: 'Zacchaeus, come down — I want to come to your house today!' Zacchaeus was so happy he promised to give back money he had taken from people. Jesus loved someone everyone else avoided. Jesus loves everyone, even people who have made mistakes.",
    verse:
      'Luke 19:9 — "Today salvation has come to this house."',
    activity:
      "Draw yourself in a tall tree. Write one way you will make things right with someone.",
    emoji: "🌳",
    image: "/kids-tree.svg",
    ref: "Luke 19:1–10",
  },
  {
    id: "good-shepherd",
    title: "The Good Shepherd",
    testament: "NT",
    book: "John",
    summary:
      "Jesus said He is like a shepherd who loves and cares for every sheep. A good shepherd knows each sheep by name and goes out to find one if it gets lost — leaving the 99 others to find the one. Jesus is our Good Shepherd — He knows your name, He loves you, and He will never leave you. You are so important to Jesus that He would leave everything to find you. You are never alone!",
    verse:
      'John 10:14 — "I am the good shepherd; I know my sheep and my sheep know me."',
    activity:
      "Draw a sheep with your name on it. Remember Jesus knows your name and loves you every day.",
    emoji: "🐑",
    image: "/kids-shepherd.svg",
    ref: "John 10:11–16",
  },
  {
    id: "lazarus",
    title: "Lazarus Lives Again!",
    testament: "NT",
    book: "John",
    summary:
      "Jesus had a good friend named Lazarus who got very sick and died. By the time Jesus arrived, Lazarus had been in the tomb for four days. Lazarus's sisters Mary and Martha were heartbroken. Jesus wept with them — He cried because He loved them. Then Jesus went to the tomb and called out: 'Lazarus, come out!' And Lazarus walked out alive! Jesus has power over death itself, and He feels our sadness with us.",
    verse:
      'John 11:35 — "Jesus wept."',
    activity:
      "Think of a time you were very sad. Write a prayer telling Jesus how you felt. Remember He cares and He has power to help.",
    emoji: "✨",
    ref: "John 11:1–44",
  },
  {
    id: "palm-sunday",
    title: "Jesus Rides into Jerusalem",
    testament: "NT",
    book: "Matthew",
    summary:
      "Jesus rode into the city of Jerusalem on a young donkey. When the crowd saw Him coming, they went wild with joy! They waved palm branches and spread their coats on the road. They shouted 'Hosanna! Blessed is He who comes in the name of the Lord!' They were welcoming Jesus as their King. This day is called Palm Sunday. Every time we praise Jesus we are joining that joyful crowd!",
    verse:
      'Matthew 21:9 — "Hosanna to the Son of David! Blessed is he who comes in the name of the Lord!"',
    activity:
      "Make a paper palm branch and wave it. Shout 'Hosanna!' and celebrate that Jesus is King!",
    emoji: "🌿",
    ref: "Matthew 21:1–11",
  },
  {
    id: "easter",
    title: "Jesus Is Alive! 🌅",
    testament: "NT",
    book: "Luke",
    summary:
      "Jesus died on the cross to take away all our sins so we could be forgiven and know God. But that is not the end of the story! Three days later, some women went to Jesus's tomb early in the morning and found it EMPTY. Angels appeared and told them: 'He is not here — He is risen!' Jesus appeared to His friends and showed them His hands. Jesus conquered death! Because Jesus is alive, we have hope forever!",
    verse:
      'Luke 24:6 — "He is not here; he has risen! Remember how he told you..."',
    activity:
      "Roll a stone (or ball) away from a door and shout: 'He is risen!' Tell someone the Easter story today.",
    emoji: "🌅",
    ref: "Luke 24:1–8",
  },
  {
    id: "pentecost",
    title: "The Holy Spirit Comes",
    testament: "NT",
    book: "Acts",
    summary:
      "After Jesus went back to heaven, His disciples were all together praying in a room. Suddenly a sound like a rushing wind filled the whole house, and something like little flames of fire appeared over each person's head! They were filled with the Holy Spirit — God's power living inside them. They went out boldly and told everyone about Jesus. The Holy Spirit still lives in everyone who believes in Jesus today — including you!",
    verse:
      'Acts 2:4 — "All of them were filled with the Holy Spirit."',
    activity:
      "Draw each disciple with a little flame above their head. Thank God that His Spirit lives in you too!",
    emoji: "🔥",
    ref: "Acts 2:1–4",
  },
  {
    id: "paul",
    title: "Paul Meets Jesus",
    testament: "NT",
    book: "Acts",
    summary:
      "A man named Saul was very mean to Christians and tried to stop them. One day on the road to Damascus a blinding light flashed from the sky and Saul fell down. He heard Jesus's voice saying: 'Saul, why are you hurting me?' Saul was blind for 3 days. A follower of Jesus came and prayed for him, and Saul could see again. Saul changed his name to Paul and became one of the greatest missionaries ever! No one is too far from God's reach.",
    verse:
      'Acts 9:5 — "Who are you, Lord?" Saul asked. "I am Jesus, whom you are persecuting."',
    activity:
      "Write the name SAUL → PAUL. Talk about how God can change anyone's heart, including yours.",
    emoji: "💫",
    ref: "Acts 9:1–20",
  },
  {
    id: "armor-god",
    title: "The Armor of God",
    testament: "NT",
    book: "Ephesians",
    summary:
      "The apostle Paul wrote that God gives us special armor so we can stand strong! The Belt of Truth — always be honest. The Breastplate of Righteousness — do what is right. The Shoes of Peace — share good news. The Shield of Faith — trust God. The Helmet of Salvation — remember you are saved. The Sword of the Spirit — know your Bible! Put on God's armor every single day!",
    verse:
      'Ephesians 6:11 — "Put on the full armor of God so that you can take your stand."',
    activity:
      "Draw a knight wearing all 6 pieces of God's armor. Label each one. Which piece do you need most today?",
    emoji: "🛡️",
    ref: "Ephesians 6:10–18",
  },
  {
    id: "love",
    title: "God's Big Love",
    testament: "NT",
    book: "John",
    summary:
      "The most important thing in the whole Bible is that God loves you! God loved the world so much that He gave His only Son Jesus for us. No matter what you do, no matter how you feel, nothing can separate you from God's love. His love is bigger than the sky, deeper than the ocean, and stronger than anything. And God's love lasts forever and ever — without end!",
    verse:
      'John 3:16 — "For God so loved the world that he gave his one and only Son."',
    activity:
      "Make a love card for someone in your family. On the back write: 'God loves you and so do I!'",
    emoji: "❤️",
    image: "/kids-heart.svg",
    ref: "John 3:16",
  },
  {
    id: "memory",
    title: "Memory Verse Challenge",
    testament: "OT",
    book: "Psalms",
    summary:
      "The Bible is full of verses that help us every single day! When we remember God's Word, it is like a lamp that lights up the path in front of us when things feel dark or confusing. This week's challenge: pick one of the verses below, say it out loud 3 times, write it on a card, and try to remember it all week. You can do it — God will help you!",
    verse:
      'Psalm 119:105 — "Your word is a lamp to my feet and a light to my path."',
    activity:
      "Write your favorite Bible verse on a card. Decorate it and put it somewhere you will see it every morning.",
    emoji: "📖",
    image: "/kids-book.svg",
    ref: "Psalm 119:105",
  },
  {
    id: "thankful",
    title: "A Thankful Heart",
    testament: "OT",
    book: "Psalms",
    summary:
      "Every single day is a gift from God! The Bible tells us to give thanks in everything. When we wake up, when we eat, when we play, when we see something beautiful — we can say thank you to God. A thankful heart sees the good things all around. Let's practice finding something to be grateful for every single day — because there is always something to thank God for!",
    verse:
      'Psalm 118:24 — "This is the day that the Lord has made; let us rejoice and be glad in it."',
    activity:
      "Start a thankfulness journal. Write or draw 3 things you are thankful for today. Do it again tomorrow!",
    emoji: "🌻",
    image: "/kids-sun.svg",
    ref: "Psalm 118:24",
  },

  // ── MISSING OT BOOKS ───────────────────────────────────────────────────────
  {
    id: "leviticus",
    title: "God's Special Rules",
    testament: "OT",
    book: "Leviticus",
    summary:
      "After God rescued His people from Egypt, He gave them special rules about how to worship, stay healthy, and treat each other well. The most important rule was: 'Love your neighbor as yourself!' God wanted His people to be holy — which means set apart and different in a good way, just like God. When we are kind, honest, and fair, we show the world what God is like.",
    verse: 'Leviticus 19:18 — "Love your neighbor as yourself. I am the Lord."',
    activity: "Write 3 ways you can be a good neighbor to someone near you this week. Do one today!",
    emoji: "🕊️",
    ref: "Leviticus 19:18",
  },
  {
    id: "numbers-donkey",
    title: "Balaam's Talking Donkey",
    testament: "OT",
    book: "Numbers",
    summary:
      "A man named Balaam was riding his donkey when the donkey suddenly stopped — three times! An angel was blocking the road. Balaam couldn't see the angel, but his donkey could! God opened the donkey's mouth and it TALKED: 'Why did you hit me?' Balaam was completely shocked! God used a donkey to get Balaam's attention and protect him. God can use anything and anyone to speak to us — even a donkey!",
    verse: 'Numbers 22:28 — "Then the Lord opened the donkey\'s mouth, and it said to Balaam, \'What have I done to you?\'"',
    activity: "Draw Balaam looking surprised at his talking donkey! Talk about a surprising way God has gotten your attention.",
    emoji: "🫏",
    ref: "Numbers 22:21–34",
  },
  {
    id: "deuteronomy",
    title: "Love God with All Your Heart",
    testament: "OT",
    book: "Deuteronomy",
    summary:
      "Before Moses died, he gathered all of God's people together and gave them the most important reminder ever: Love God with ALL your heart, ALL your soul, and ALL your strength! Then he told parents to teach their children about God every single day — when they wake up, eat, walk around, and go to sleep. Loving God is not just for Sundays — it is for every moment of every day!",
    verse: 'Deuteronomy 6:5 — "Love the Lord your God with all your heart and with all your soul and with all your strength."',
    activity: "Make a 'love God' checklist: morning prayer, thank God at lunch, read a verse at bedtime. Check each one off!",
    emoji: "💛",
    ref: "Deuteronomy 6:4–9",
  },
  {
    id: "gideon",
    title: "Gideon's Tiny Army",
    testament: "OT",
    book: "Judges",
    summary:
      "God's people were being bullied by their enemies. God chose a man named Gideon to lead His army — but Gideon thought he was too small and weak! God said: 'I will be with you!' God even made Gideon's army smaller on purpose — down to just 300 people — to show that the victory came from God, not from big numbers. With torches, trumpets, and God's help, those 300 defeated a huge army! God loves to use people others think are too small.",
    verse: 'Judges 6:16 — "The Lord answered, \'I will be with you, and you will strike down all the Midianites.\'"',
    activity: "Draw Gideon's 300 soldiers with torches and trumpets! Write: one time you felt too small for something but God helped you.",
    emoji: "🔦",
    ref: "Judges 6–7",
  },
  {
    id: "2-samuel",
    title: "David's Kindness to Mephibosheth",
    testament: "OT",
    book: "2 Samuel",
    summary:
      "When David became king, he remembered his best friend Jonathan who had died. Jonathan had a son named Mephibosheth who couldn't walk. David found him, brought him to the palace, and gave him a permanent seat at the royal table — every day for the rest of his life! David showed kindness not because he had to, but because he wanted to. God treats us the same way — He invites us to His table because He loves us, not because we earned it.",
    verse: '2 Samuel 9:13 — "And Mephibosheth lived in Jerusalem, because he always ate at the king\'s table."',
    activity: "Set an extra place at dinner tonight. Talk about how God invites everyone to His table simply because He loves them.",
    emoji: "🍽️",
    ref: "2 Samuel 9",
  },
  {
    id: "naaman",
    title: "Naaman is Healed",
    testament: "OT",
    book: "2 Kings",
    summary:
      "Naaman was a powerful army commander with a skin disease no doctor could cure. A little servant girl told him about the prophet Elisha in Israel. Elisha sent a simple message: 'Wash in the Jordan River 7 times.' Naaman was annoyed — that sounded too easy! But his servants talked him into trying. After the 7th dip, his skin was completely healed, smooth like a child's! Sometimes God's answer looks surprisingly simple, but we have to trust and obey.",
    verse: '2 Kings 5:14 — "His flesh was restored and became clean like that of a young boy."',
    activity: "Dip your hands in water 7 times and count out loud. Thank God for healing. Write a prayer for someone who needs it.",
    emoji: "🩹",
    ref: "2 Kings 5:1–14",
  },
  {
    id: "1-chronicles",
    title: "David Prepares God's House",
    testament: "OT",
    book: "1 Chronicles",
    summary:
      "King David had a dream — he wanted to build a beautiful temple for God. But God said: 'Your son Solomon will build it.' David wasn't sad. Instead, he worked hard gathering gold, silver, and wood so Solomon could build it. David said: 'I have prepared with all my might for the house of my God!' Sometimes our job is to prepare the way for someone else. That is just as important and just as pleasing to God!",
    verse: '1 Chronicles 29:2 — "With all my resources I have prepared for the temple of my God."',
    activity: "Help prepare something for someone else today — set the table, pack a bag, or get something ready. That's serving God!",
    emoji: "🏛️",
    ref: "1 Chronicles 29:1–5",
  },
  {
    id: "2-chronicles",
    title: "Solomon Builds God's House",
    testament: "OT",
    book: "2 Chronicles",
    summary:
      "Solomon built the most magnificent temple the world had ever seen — filled with gold and beautiful wood. When it was finished and everyone prayed together, something amazing happened: the glory of God came down like a bright cloud and filled the entire temple! The priests couldn't even stand up because God's presence was so powerful. God loved that His people created a beautiful place to worship Him. God still fills our worship with His presence today!",
    verse: '2 Chronicles 7:1 — "When Solomon finished praying, fire came down from heaven and the glory of the Lord filled the temple."',
    activity: "Draw the most beautiful church or temple you can imagine. Thank God that He lives not just in buildings but in our hearts!",
    emoji: "✨",
    ref: "2 Chronicles 7:1–3",
  },
  {
    id: "ezra",
    title: "Rebuilding God's Temple",
    testament: "OT",
    book: "Ezra",
    summary:
      "God's people had been taken away from their land, and the temple in Jerusalem was destroyed. But God moved the heart of King Cyrus to let the people go home to rebuild! It was hard work and people tried to stop them, but with God's help they kept going. When the foundation was laid, some people shouted for joy and some cried happy tears — it was that meaningful to them. Whenever we put God back at the center, it is always worth the hard work.",
    verse: 'Ezra 3:11 — "With praise and thanksgiving they sang to the Lord: \'He is good; his love to Israel endures forever.\'"',
    activity: "Build a simple structure with blocks or pillows. Think: what are the foundations in YOUR life that help you follow God?",
    emoji: "🔨",
    ref: "Ezra 3:10–11",
  },
  {
    id: "nehemiah",
    title: "Building the Wall Together",
    testament: "OT",
    book: "Nehemiah",
    summary:
      "Nehemiah was a cupbearer to the king, but when he heard that Jerusalem's walls were broken down, he wept and prayed. Then he asked the king for permission to go fix it! The king said yes. Nehemiah rallied the people and they all worked together — neighbors building the section of wall right in front of their own homes. They rebuilt the entire wall in just 52 days! When enemies tried to scare them, Nehemiah said: 'Remember the Lord!' Together with God, we can rebuild anything.",
    verse: 'Nehemiah 4:14 — "Remember the Lord, who is great and awesome."',
    activity: "Do a teamwork project with your family — build something, clean a room, or cook together. Teamwork with God is powerful!",
    emoji: "🧱",
    ref: "Nehemiah 4:14",
  },
  {
    id: "job",
    title: "Job Never Gave Up",
    testament: "OT",
    book: "Job",
    summary:
      "Job was a good man who loved God, but one day everything went wrong — he lost his animals, his home, and his health. Job's friends said it must be his own fault. But Job kept talking to God, even when he was deeply sad and confused. God spoke to Job from a whirlwind and showed him how big and amazing He is. In the end, God restored everything Job had lost. It's okay to ask God hard questions. He is big enough for all of them, and He never leaves us.",
    verse: 'Job 1:21 — "The Lord gave and the Lord has taken away; may the name of the Lord be praised."',
    activity: "Write a question you have for God right now. It's okay to ask! Then write one way you will trust God while you wait.",
    emoji: "🌈",
    ref: "Job 1:21",
  },
  {
    id: "psalms",
    title: "David's Songs to God",
    testament: "OT",
    book: "Psalms",
    summary:
      "The book of Psalms is like a giant songbook with 150 songs and prayers! King David wrote many of them. Some psalms are joyful praises. Some are written when David was scared or hurting. Some ask for help. Some say thank you. No matter how David felt, he always ended up back with God. Psalm 23 says God is our Shepherd who leads us, protects us, and gives us everything we need. You can write your own psalm today — God loves to hear from you!",
    verse: 'Psalm 23:1 — "The Lord is my shepherd; I shall not want."',
    activity: "Write your own psalm! Start: 'Thank you God for...' then 'Help me with...' then 'I trust you because...'",
    emoji: "🎵",
    ref: "Psalm 23:1",
  },
  {
    id: "proverbs",
    title: "Solomon's Wise Words",
    testament: "OT",
    book: "Proverbs",
    summary:
      "King Solomon was the wisest person who ever lived, and he wrote thousands of wise sayings to help us live well. Proverbs teaches us to be kind, work hard, tell the truth, choose good friends, and listen to our parents. One of the most important proverbs says: trust in God with everything in your heart and do not depend only on what you think you know. Reading Proverbs every day is like getting advice from the wisest person who ever lived!",
    verse: 'Proverbs 3:5 — "Trust in the Lord with all your heart and lean not on your own understanding."',
    activity: "Find your favorite Proverb and write it on a card for your room. Try to memorize it this week!",
    emoji: "💡",
    ref: "Proverbs 3:5–6",
  },
  {
    id: "ecclesiastes",
    title: "What Really Matters Most",
    testament: "OT",
    book: "Ecclesiastes",
    summary:
      "Solomon tried everything in the world to find happiness — money, parties, building projects, and more. But after all of it, he said something surprising: without God, nothing truly satisfies. It's like chasing the wind! Then he found the most important truth: honor God and keep His commandments — THAT is what life is all about! The best life is not the richest or the most famous. It's the one lived closest to God.",
    verse: 'Ecclesiastes 12:13 — "Fear God and keep his commandments, for this is the duty of all mankind."',
    activity: "Make two lists: 'things I THINK will make me happy' and 'things that REALLY make me happy.' Talk about which list has God in it.",
    emoji: "🌬️",
    ref: "Ecclesiastes 12:13",
  },
  {
    id: "song-of-solomon",
    title: "God's Beautiful Love Song",
    testament: "OT",
    book: "Song of Solomon",
    summary:
      "The Song of Solomon is a beautiful love poem that shows us how wonderful and special love is. God created love — it is His idea and His gift! This book compares God's love for us to the best kind of friendship — loyal, tender, strong, and never-ending. God doesn't just tolerate us. He delights in us! He calls us beautiful and beloved. Just like a best friend who always wants to be near you, God always wants to be close to you.",
    verse: 'Song of Solomon 2:4 — "His banner over me is love."',
    activity: "Write a 'love note' to God telling Him what you love about Him. Then write what you think God loves about you!",
    emoji: "🌹",
    ref: "Song of Solomon 2:4",
  },
  {
    id: "isaiah",
    title: "The Promised Savior",
    testament: "OT",
    book: "Isaiah",
    summary:
      "Isaiah was a prophet who lived 700 years before Jesus was born — and he described Jesus perfectly! He said a special child would be born and would be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. Isaiah also wrote that God's servant would carry our mistakes so we could be forgiven. When we read Isaiah and then read about Jesus, we can see that God had the rescue plan all along! Every promise God makes, He keeps.",
    verse: 'Isaiah 9:6 — "He will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace."',
    activity: "Look at the Christmas story in Luke 2. Find 3 things Isaiah predicted that came true about Jesus!",
    emoji: "🌟",
    ref: "Isaiah 9:6",
  },
  {
    id: "jeremiah",
    title: "God Has Plans for You",
    testament: "OT",
    book: "Jeremiah",
    summary:
      "God called Jeremiah when he was very young. Jeremiah said: 'I don't know how to speak — I'm just a child!' But God said: 'Don't say you're only a child. I will be with you and give you the words!' God also gave Jeremiah one of the most beautiful promises in the whole Bible: 'I know the plans I have for you — plans to give you hope and a good future.' God says those same words to YOU. He has a special plan for your life!",
    verse: 'Jeremiah 29:11 — "For I know the plans I have for you — plans to give you hope and a future."',
    activity: "Write Jeremiah 29:11 on paper and decorate it. Put it somewhere you see it every day as a reminder.",
    emoji: "📝",
    ref: "Jeremiah 29:11",
  },
  {
    id: "lamentations",
    title: "Talking to God When You Are Sad",
    testament: "OT",
    book: "Lamentations",
    summary:
      "Lamentations is a book of sad poems written when the city of Jerusalem was destroyed. The writer was heartbroken and honest with God about how painful everything felt. But right in the middle of all that sadness, something beautiful appears: 'The steadfast love of the Lord never ceases — His mercies are new every single morning!' Even in the saddest moments, God's love is still there. It's okay to cry and tell God how you feel. He always listens, and His love never runs out.",
    verse: 'Lamentations 3:22–23 — "His mercies never come to an end; they are new every morning."',
    activity: "Write something that made you sad lately as a prayer to God. Then write: 'But God, I know Your love never ends.'",
    emoji: "💧",
    ref: "Lamentations 3:22–23",
  },
  {
    id: "ezekiel",
    title: "The Valley of Dry Bones",
    testament: "OT",
    book: "Ezekiel",
    summary:
      "God showed the prophet Ezekiel a strange vision — a huge valley completely full of old, dry bones. God asked: 'Can these bones live?' Ezekiel said: 'Only You know, God!' Then God told Ezekiel to speak to the bones — and as he spoke, the bones rattled together, grew muscles and skin, and stood up as a great living army! God said: 'I will put my Spirit in you, and you will live!' God can bring NEW life to anything — even things that seem completely hopeless.",
    verse: 'Ezekiel 37:5 — "I will make breath enter you, and you will come to life."',
    activity: "Draw the valley with dry bones, then draw the same valley with a standing army. Thank God for bringing new life!",
    emoji: "🦴",
    ref: "Ezekiel 37:1–10",
  },
  {
    id: "hosea",
    title: "God's Faithful Love Never Quits",
    testament: "OT",
    book: "Hosea",
    summary:
      "God asked the prophet Hosea to show His people something important by living it out. Hosea's wife walked away from him, but God told Hosea to go find her and bring her back — to show how God keeps loving His people even when they walk away from Him. No matter how far we run, God keeps calling us home. His love is faithful, patient, and never gives up. God will always come looking for you, just like a shepherd who searches for one lost sheep.",
    verse: 'Hosea 3:1 — "Love her as the Lord loves the Israelites, even though they turn to other gods."',
    activity: "Think of someone you need to forgive. Write a kind note to them or say sorry. God's love is patient and keeps going!",
    emoji: "💙",
    ref: "Hosea 3:1",
  },
  {
    id: "joel",
    title: "God Restores Everything",
    testament: "OT",
    book: "Joel",
    summary:
      "The land of Israel was devastated by a massive swarm of locusts that ate all the crops. Everything was gone! But God spoke through the prophet Joel with an amazing promise: 'I will restore the years the locusts have eaten.' No matter what has been lost or broken in our lives, God can restore and make things new! Joel also promised that God would pour out His Spirit on everyone — young people, old people, boys and girls. That promise came true at Pentecost!",
    verse: 'Joel 2:25 — "I will repay you for the years the locusts have eaten."',
    activity: "Draw a plant eaten away... then draw it blooming back. Trust God to restore the things in your life that feel lost.",
    emoji: "🌱",
    ref: "Joel 2:25",
  },
  {
    id: "amos",
    title: "God Loves Fairness",
    testament: "OT",
    book: "Amos",
    summary:
      "Amos was a simple shepherd and fruit farmer — not a fancy preacher — but God called him to deliver an important message: be fair and kind to everyone, especially those who are poor and left out. God doesn't want just songs and ceremonies if people are being treated unfairly. He wants justice to flow like a river! This means standing up for people who are treated badly, sharing what we have, and treating everyone the way we want to be treated.",
    verse: 'Amos 5:24 — "But let justice roll on like a river, righteousness like a never-failing stream!"',
    activity: "Think of one way you can stand up for someone being left out or treated unfairly. Write it down and do it this week!",
    emoji: "⚖️",
    ref: "Amos 5:24",
  },
  {
    id: "obadiah",
    title: "Don't Be Too Proud",
    testament: "OT",
    book: "Obadiah",
    summary:
      "Obadiah is the shortest book in the Old Testament — just one chapter! It warns a nation called Edom that they were too proud. They lived high up in the mountains and thought nobody could ever reach them. But God sees pride, and He says those who are proud will fall, while the humble will be lifted up. Everything we have comes from God — our talents, our family, our opportunities. Be thankful and humble, never boastful!",
    verse: 'Obadiah 1:3 — "The pride of your heart has deceived you."',
    activity: "Write 3 things you are really good at. Next to each one write: 'Thank you God for giving me this gift!'",
    emoji: "🦅",
    ref: "Obadiah 1:3",
  },
  {
    id: "micah",
    title: "Do Justice and Love Kindness",
    testament: "OT",
    book: "Micah",
    summary:
      "The prophet Micah asked a great question: what does God really want from us? The answer is beautifully simple — do what is right, love being kind to others, and walk humbly with God. Not fancy ceremonies or expensive gifts — just justice, kindness, and humility every single day! Micah also predicted that the Messiah would be born in Bethlehem, hundreds of years before Jesus was actually born there. God told us His plan all along!",
    verse: 'Micah 6:8 — "Act justly and to love mercy and to walk humbly with your God."',
    activity: "Write Micah 6:8 on a card. Circle the 3 things God asks for: justice, mercy, humility. Do one of each this week!",
    emoji: "🤲",
    ref: "Micah 6:8",
  },
  {
    id: "nahum",
    title: "God Protects His People",
    testament: "OT",
    book: "Nahum",
    summary:
      "Nahum brought good news to God's people: the powerful city of Nineveh, which had been bullying them, would fall. God is slow to anger and very patient, but He is also completely fair and always protects His children. When it seems like the bullies are winning, remember: God sees everything! He is a shelter for those who trust Him. The Bible says God is a stronghold — like a super-strong fortress — in the day of trouble for those who run to Him.",
    verse: 'Nahum 1:7 — "The Lord is good, a refuge in times of trouble. He cares for those who trust in him."',
    activity: "Draw a strong castle. Write 'GOD' on the gate. Inside, write YOUR name — you are safe with God!",
    emoji: "🛡️",
    ref: "Nahum 1:7",
  },
  {
    id: "habakkuk",
    title: "Trust God Even When It's Hard",
    testament: "OT",
    book: "Habakkuk",
    summary:
      "Habakkuk was honest with God — he asked hard questions like 'Why do bad things keep winning?' God answered and said: 'Wait for it — the righteous person will live by faithfulness.' Habakkuk decided to trust God even if crops failed, even if animals died, even if everything went wrong — he would STILL choose joy in the God of his salvation! Sometimes faith means choosing to rejoice and trust even when life is confusing or hard. That is the strongest kind of faith.",
    verse: 'Habakkuk 3:18 — "Yet I will rejoice in the Lord, I will be joyful in God my Savior."',
    activity: "Write 3 hard things in your world right now. Then write: 'But I will trust God because He is always good.'",
    emoji: "🌿",
    ref: "Habakkuk 3:17–18",
  },
  {
    id: "zephaniah",
    title: "God Sings Over You!",
    testament: "OT",
    book: "Zephaniah",
    summary:
      "Zephaniah has one of the most wonderful verses in the whole Bible — did you know that God SINGS over you? God is so happy about you that He quiets everything down and bursts into a joyful song! God doesn't just put up with you or barely notice you. He DELIGHTS in you, He celebrates you, and He sings because of YOU! Next time you feel small, forgotten, or not good enough, remember: the Creator of the whole universe is singing a love song just for you.",
    verse: 'Zephaniah 3:17 — "He will rejoice over you with singing."',
    activity: "Make up a song about how much God loves you. Sing it out loud! God loves to hear your voice.",
    emoji: "🎶",
    ref: "Zephaniah 3:17",
  },
  {
    id: "haggai",
    title: "Put God First",
    testament: "OT",
    book: "Haggai",
    summary:
      "When God's people came back to their land, they were so busy building their own nice houses that they forgot to rebuild God's temple! God spoke through the prophet Haggai: 'Why are you living in paneled houses while My house lies in ruins?' The people had been working hard but nothing was going well. When they put God first and started rebuilding His temple, God promised to bless them. Putting God first doesn't mean we can't have nice things — it just means God is always most important!",
    verse: 'Haggai 2:4 — "Be strong and work. For I am with you, declares the Lord."',
    activity: "Look at your daily schedule. Is there time set aside for God? Add 'time with God' to your daily plan and guard it!",
    emoji: "⛪",
    ref: "Haggai 1:7–8",
  },
  {
    id: "zechariah",
    title: "The Coming King on a Donkey",
    testament: "OT",
    book: "Zechariah",
    summary:
      "The prophet Zechariah had amazing visions about the future, and he made one very specific prediction 500 years before it happened: 'Your King is coming, riding on a donkey!' And sure enough, on Palm Sunday, Jesus rode into Jerusalem on a donkey — exactly as Zechariah said! Zechariah also described a shepherd being struck and the sheep scattering — pointing to Jesus on the cross. God gave us the whole story of Jesus hundreds of years before it happened!",
    verse: 'Zechariah 9:9 — "See, your king comes to you, gentle and riding on a donkey."',
    activity: "Read Palm Sunday in Matthew 21. Count how many things Zechariah predicted that came true! God keeps every promise.",
    emoji: "🎺",
    ref: "Zechariah 9:9",
  },
  {
    id: "malachi",
    title: "God Never Changes",
    testament: "OT",
    book: "Malachi",
    summary:
      "Malachi is the very last book of the Old Testament. After all the stories — after all the adventures, mistakes, and rescues of God's people — God says one wonderful thing: 'I the Lord do not change.' His love never changes. His faithfulness never changes. His promises never change. Malachi also promised that before the Messiah came, a messenger would prepare the way — and that was John the Baptist! Then came Jesus. The whole Old Testament points to Him. What a story God tells!",
    verse: 'Malachi 3:6 — "I the Lord do not change."',
    activity: "List 5 things that have changed in your life recently. Then write: 'But GOD never changes!' Thank Him for being your constant rock.",
    emoji: "☀️",
    ref: "Malachi 3:6",
  },

  // ── MISSING NT BOOKS ───────────────────────────────────────────────────────
  {
    id: "romans",
    title: "Nothing Can Separate Us",
    testament: "NT",
    book: "Romans",
    summary:
      "The apostle Paul wrote Romans to explain the best news ever: everyone has done wrong things, but Jesus died to make us right with God — and all we have to do is trust in Him! Paul also wrote something wonderfully encouraging: nothing in the whole universe can separate us from God's love. Not trouble, danger, sadness, angels, or ANYTHING in all creation. God's love is yours forever, and absolutely nothing can take it away!",
    verse: 'Romans 8:38–39 — "Neither death nor life... nor anything else in all creation, will be able to separate us from the love of God."',
    activity: "Make a list of scary things. Next to each one write: 'But it cannot separate me from God\'s love!' Thank God for unbreakable love.",
    emoji: "💜",
    ref: "Romans 8:38–39",
  },
  {
    id: "1-corinthians",
    title: "What Love Really Looks Like",
    testament: "NT",
    book: "1 Corinthians",
    summary:
      "Paul wrote the most famous description of love ever written: Love is patient. Love is kind. Love doesn't brag or keep a list of wrongs. Love never gives up and never fails! This kind of love is not just a feeling — it is a CHOICE. We choose to be patient. We choose to be kind. We choose to forgive. Paul says that even if you can do amazing things but don't have love, it means nothing. Love is the most important thing in the world.",
    verse: '1 Corinthians 13:4 — "Love is patient, love is kind. It does not envy, it does not boast."',
    activity: "For each person in your family, write one way you will show patient, kind love to them today.",
    emoji: "💕",
    ref: "1 Corinthians 13:4–7",
  },
  {
    id: "2-corinthians",
    title: "Strong When You Feel Weak",
    testament: "NT",
    book: "2 Corinthians",
    summary:
      "Paul went through really hard times — shipwrecked, beaten, and hungry. He asked God three times to take his struggles away. God's answer was: 'My grace is enough for you — My power works BEST when you feel weak!' Paul actually started to rejoice about his weaknesses, because when he was weak, God's strength shone through him! When you feel like you cannot do something, that is when God's power can really show up in you!",
    verse: '2 Corinthians 12:9 — "My power is made perfect in weakness."',
    activity: "Write one thing you feel too weak to do. Then pray: 'God, show YOUR strength through me in this.' Say it every morning!",
    emoji: "💪",
    ref: "2 Corinthians 12:9",
  },
  {
    id: "galatians",
    title: "The Fruit of the Spirit",
    testament: "NT",
    book: "Galatians",
    summary:
      "Paul wrote to remind the Galatians that we are saved by trusting Jesus — not by following a long list of rules perfectly. When we let God's Holy Spirit guide us, something beautiful grows in our lives like fruit on a healthy tree! The fruit of the Spirit is: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control. You can not grow this fruit by trying harder. It grows when you stay close to God, like a branch connected to the vine.",
    verse: 'Galatians 5:22–23 — "The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness and self-control."',
    activity: "Draw a tree with 9 fruits. Write one fruit of the Spirit on each one. Circle 2 you want to grow in this week.",
    emoji: "🍎",
    ref: "Galatians 5:22–23",
  },
  {
    id: "philippians",
    title: "Rejoice Always!",
    testament: "NT",
    book: "Philippians",
    summary:
      "Paul wrote Philippians from PRISON — and it is the happiest book in the whole Bible! He says 'rejoice' over and over. How could he be joyful in jail? Paul discovered a secret: he could be content in any situation because Jesus was with him. He wrote: 'I can do all things through Christ who gives me strength!' Real joy does not come from everything going right. It comes from knowing Jesus is with you no matter what — and THAT is a joy nobody can ever take away.",
    verse: 'Philippians 4:4 — "Rejoice in the Lord always. I will say it again: Rejoice!"',
    activity: "Write 5 reasons to rejoice RIGHT NOW — even if today is hard. Choose joy! Joy is a superpower from God.",
    emoji: "😊",
    ref: "Philippians 4:4–7",
  },
  {
    id: "colossians",
    title: "Do Everything for God",
    testament: "NT",
    book: "Colossians",
    summary:
      "Paul wrote to the Colossians: whatever you do — eating, playing, studying, helping at home — do it all for God! Even doing your homework or cleaning your room can honor God when you do it with a good and cheerful heart. Paul also says to set your mind on things above — fill your thoughts with what is true, good, and beautiful. Jesus is above everything, and when He is first in our hearts and minds, everything else falls into place.",
    verse: 'Colossians 3:23 — "Whatever you do, work at it with all your heart, as working for the Lord."',
    activity: "Pick one everyday chore and do it as excellently as you can as an offering to God. How does that change how you do it?",
    emoji: "⭐",
    ref: "Colossians 3:23",
  },
  {
    id: "1-thessalonians",
    title: "Pray Without Stopping!",
    testament: "NT",
    book: "1 Thessalonians",
    summary:
      "Paul gave his friends three short but powerful instructions: always be joyful, pray continually, and give thanks in every situation! Praying continually does not mean you have to be on your knees all day. It means living in constant conversation with God — thanking Him, asking Him, talking to Him throughout your whole day. Think of God as your best friend you are always chatting with, no matter what you are doing. He is always listening!",
    verse: '1 Thessalonians 5:17 — "Pray continually."',
    activity: "Try talking to God all day today — thank Him when something good happens, ask Him when something is hard. Count how many times!",
    emoji: "🙌",
    ref: "1 Thessalonians 5:16–18",
  },
  {
    id: "2-thessalonians",
    title: "Never Tire of Doing Good",
    testament: "NT",
    book: "2 Thessalonians",
    summary:
      "Paul's second letter to Thessalonica encouraged everyone to keep going. Sometimes doing the right thing is exhausting, especially when others around you are not doing what is right. But Paul says: never get tired of doing good! God sees every kind thing you do, every time you choose right when wrong would have been easier, every small act of love that nobody noticed. Every bit of goodness matters to God. Keep going — you are making a difference!",
    verse: '2 Thessalonians 3:13 — "Never tire of doing what is good."',
    activity: "List 3 good things you can do today even if nobody notices or says thank you. Do them all — God always sees!",
    emoji: "🌟",
    ref: "2 Thessalonians 3:13",
  },
  {
    id: "1-timothy",
    title: "Be an Example",
    testament: "NT",
    book: "1 Timothy",
    summary:
      "Paul wrote to his young friend Timothy, who was leading a church. Timothy might have felt too young to be taken seriously, but Paul told him something wonderful: 'Don't let anyone look down on you because you are young, but set an example for everyone in speech, love, faith, and purity.' YOU do not have to be grown-up to be a great example! Every child can show others what love and kindness look like. People are always watching — let your life show Jesus!",
    verse: '1 Timothy 4:12 — "Don\'t let anyone look down on you because you are young, but set an example."',
    activity: "Write 3 ways you will be an example this week — at home, at school, and with your friends.",
    emoji: "🌠",
    ref: "1 Timothy 4:12",
  },
  {
    id: "2-timothy",
    title: "God's Word Never Gets Old",
    testament: "NT",
    book: "2 Timothy",
    summary:
      "Paul's last letter to Timothy was written from prison, knowing he might die soon. But Paul was still full of faith and joy! He told Timothy to hold tight to what he had learned from the Bible since he was a little child. Paul wrote: 'All Scripture is God-breathed.' The Bible is not just an old book — every single word in it came from God's own breath! It is alive and powerful. Reading the Bible every day is how we grow closer to God and learn to live well.",
    verse: '2 Timothy 3:16 — "All Scripture is God-breathed and is useful for teaching... and training in righteousness."',
    activity: "Pick a Bible book you have never read and read one chapter. Write one thing you learned. There is always something new!",
    emoji: "📖",
    ref: "2 Timothy 3:16",
  },
  {
    id: "titus",
    title: "Be Kind to Everyone",
    testament: "NT",
    book: "Titus",
    summary:
      "Paul wrote to his friend Titus, who was leading churches on the island of Crete. Paul reminded him that before people know Jesus, they can be unkind and selfish. But when we meet Jesus, everything changes! God poured out His kindness on us — not because we earned it, but because He is gracious. Now we get to pass that kindness along! Paul says: be ready for every good work, speak kindly about people, be gentle, and show true kindness to everyone.",
    verse: 'Titus 3:2 — "Be gentle, and show true humility toward all people."',
    activity: "Say something kind to every person you see today. Keep a count! How many kind words can you give away in one day?",
    emoji: "🌸",
    ref: "Titus 3:2",
  },
  {
    id: "philemon",
    title: "Choosing Forgiveness",
    testament: "NT",
    book: "Philemon",
    summary:
      "Philemon is the shortest letter Paul wrote — just one chapter! A man named Onesimus had run away from his owner Philemon. But Onesimus met Paul and became a Christian. Paul wrote to Philemon and asked him to welcome Onesimus back — not as a servant, but as a dear brother! Paul even offered to pay any debt Onesimus owed. This beautiful letter shows us what forgiveness looks like — choosing to see someone as family instead of an enemy, and offering grace instead of punishment.",
    verse: 'Philemon 1:16 — "No longer as a slave, but better than a slave, as a dear brother."',
    activity: "Is there someone you need to forgive? Write their name and write: 'I choose to forgive you and see you as a friend.' Pray for them.",
    emoji: "🕊️",
    ref: "Philemon 1:15–16",
  },
  {
    id: "hebrews",
    title: "Heroes of Faith",
    testament: "NT",
    book: "Hebrews",
    summary:
      "Hebrews chapter 11 is called the Hall of Faith — a list of all the Bible heroes who did amazing things because they TRUSTED GOD, even when they could not see what would happen next. Noah, Abraham, Moses, Rahab, Gideon, David — they all trusted God's promises. Then Hebrews says WE are surrounded by all these heroes like a huge crowd cheering us on! We get to add our names to this list. Faith means trusting God even when you cannot see the ending yet.",
    verse: 'Hebrews 11:1 — "Faith is confidence in what we hope for and assurance about what we do not see."',
    activity: "Draw a stadium packed with Bible heroes cheering for you! Write your name in the middle running the race of faith.",
    emoji: "🏆",
    ref: "Hebrews 11:1",
  },
  {
    id: "james",
    title: "Show Your Faith",
    testament: "NT",
    book: "James",
    summary:
      "James wrote something very practical: if you really believe in Jesus, it will SHOW in how you live! We will help people in need. We will be careful with our words — James says the tongue is tiny like a spark, but it can start a huge fire! We will listen more than we talk and be slow to get angry. Real faith is not just in our heads — it walks out the door and loves people in real, practical, everyday ways. Faith in action is the most powerful kind!",
    verse: 'James 2:17 — "Faith by itself, if it is not accompanied by action, is dead."',
    activity: "Do 3 acts of faith-in-action today: help someone, encourage someone, give something away. That is faith working!",
    emoji: "🌱",
    ref: "James 2:17",
  },
  {
    id: "1-peter",
    title: "Give Your Worries to God",
    testament: "NT",
    book: "1 Peter",
    summary:
      "Peter wrote to Christians going through hard times for following Jesus. He said something beautiful: you are like living stones being built into a temple for God! You are chosen, special, and precious to Him. And when worries pile up, do this one powerful thing: cast ALL your anxiety on God, because He genuinely cares for you! God is not too busy or too far away for your worries. He wants you to hand them over and trust that He is taking care of you.",
    verse: '1 Peter 5:7 — "Cast all your anxiety on him because he cares for you."',
    activity: "Write each worry on a scrap of paper. Ball them up and toss them away. Say out loud: 'God, I give these to You!'",
    emoji: "🎣",
    ref: "1 Peter 5:7",
  },
  {
    id: "2-peter",
    title: "Keep Growing with God",
    testament: "NT",
    book: "2 Peter",
    summary:
      "Peter's second letter encourages us to never stop growing in our faith! It is not something we receive once and then stop. He says to keep adding goodness, knowledge, patience, kindness, and love to our lives. Growing with God is like going to school — we keep learning something new every day! Peter also reminds us that God is patient and not slow with His promises. He is patient because He wants EVERYONE to come to know Him. He is always exactly on time.",
    verse: '2 Peter 3:18 — "Grow in the grace and knowledge of our Lord and Savior Jesus Christ."',
    activity: "Make a 'faith growth chart.' Write one thing you knew about God last year and one new thing you know now. Keep growing!",
    emoji: "📚",
    ref: "2 Peter 3:18",
  },
  {
    id: "1-john",
    title: "God Is Love",
    testament: "NT",
    book: "1 John",
    summary:
      "John wrote three simple words that changed the world: 'God is love.' Not just that God shows love sometimes — God IS love, completely and entirely. If we want to see what love truly looks like, we look at God! John says: we love each other because God first loved us. We can only truly love others when we have received God's love inside us. When we love people well, we are showing them a picture of what God is actually like. You can be a picture of God today!",
    verse: '1 John 4:8 — "Whoever does not love does not know God, because God is love."',
    activity: "Be a picture of God for someone today — show them love the way God loves you. Afterward, tell them: 'That is what God is like!'",
    emoji: "💗",
    ref: "1 John 4:8",
  },
  {
    id: "2-john",
    title: "Walk in Truth and Love",
    testament: "NT",
    book: "2 John",
    summary:
      "John's second letter is very short — only 13 verses! He writes to a church and says: 'I love you in truth.' John's big message is that love and truth always go together. Real love is not just warm feelings — it walks in the truth of God's word every day. We can be kind and loving to everyone, and we must also stay anchored to what the Bible truly says about Jesus. Love without truth is not complete, and truth without love is not complete either. We need both!",
    verse: '2 John 1:6 — "This is love: that we walk in obedience to his commands."',
    activity: "Find one truth about Jesus in the Bible. Write it on a card and share it with someone today. Truth and love make a great team!",
    emoji: "🌿",
    ref: "2 John 1:6",
  },
  {
    id: "3-john",
    title: "Be a Good Example",
    testament: "NT",
    book: "3 John",
    summary:
      "John's third letter is the shortest book in the whole New Testament! John writes to his friend Gaius to say: 'I hope you are as healthy in body as you are strong in spirit!' He praises Gaius for being faithful, welcoming believers, and walking in truth. Then John says a key thing: 'Do not imitate what is evil but what is good!' We become like whoever we watch and follow. Choose good examples — people who love God and love others — and be that good example for someone else too.",
    verse: '3 John 1:11 — "Do not imitate what is evil but what is good. Anyone who does what is good is from God."',
    activity: "Write the name of one person you look up to as a great example of following God. What makes them that way? How can you be one too?",
    emoji: "👍",
    ref: "3 John 1:11",
  },
  {
    id: "jude",
    title: "Stay Strong in Faith",
    testament: "NT",
    book: "Jude",
    summary:
      "Jude's short letter is like an encouraging pep talk to stay strong! He says: build yourself up in your most holy faith and pray in the Holy Spirit. When we strengthen our faith every day — reading the Bible, praying, being with other believers, and remembering God's love — we can stand firm no matter what. Jude ends with one of the most wonderful blessings anywhere in the Bible: God is able to keep you from stumbling and present you before His presence with GREAT JOY! Hold on to Him!",
    verse: 'Jude 1:24 — "To him who is able to keep you from stumbling and to present you before his glorious presence without fault."',
    activity: "Write Jude 1:24 on paper. When you feel shaky in your faith, read it out loud and remember: God is holding you!",
    emoji: "🛡️",
    ref: "Jude 1:20–24",
  },
  {
    id: "revelation",
    title: "God Wins! A Brand New World",
    testament: "NT",
    book: "Revelation",
    summary:
      "The last book of the Bible is Revelation — amazing visions given to the apostle John about heaven and the future! It can seem mysterious, but the main message is wonderfully simple: GOD WINS! No matter how hard things get on earth, in the end Jesus returns as King of kings. God makes ALL things new. There will be no more crying, no more pain, no more death. God will wipe away every single tear from every eye. The whole Bible ends with God living with His people in perfect love — forever and ever. What an ending!",
    verse: 'Revelation 21:4 — "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain."',
    activity: "Draw your best picture of heaven — no tears, no sadness, God with His people forever! What do you look forward to most?",
    emoji: "🌈",
    ref: "Revelation 21:4–5",
  },
];

// ── QUIZ ──────────────────────────────────────────────────────────────────────
type QuizQ = {
  question: string;
  options: string[];
  answer: number;
  fun: string;
};

const quizQuestions: QuizQ[] = [
  {
    question: "How many days did it take God to create the world?",
    options: ["5 days", "6 days", "7 days", "10 days"],
    answer: 1,
    fun: "God created everything in 6 days and rested on the 7th — that's why we have a day of rest each week!",
  },
  {
    question: "What animal tricked Eve in the Garden of Eden?",
    options: ["A lion", "A bird", "A serpent (snake)", "A fox"],
    answer: 2,
    fun: "The serpent was sneaky and told Eve the fruit would make her wise — but obeying God is the real wisdom!",
  },
  {
    question: "In what city was Jesus born?",
    options: ["Jerusalem", "Nazareth", "Bethlehem", "Jericho"],
    answer: 2,
    fun: "The prophet Micah predicted 700 years earlier that the Messiah would be born in Bethlehem — and he was!",
  },
  {
    question: "How many stones did David use to defeat Goliath?",
    options: ["5 stones", "3 stones", "1 stone", "10 stones"],
    answer: 2,
    fun: "David picked up 5 smooth stones but only needed 1. With God's help, one is always enough!",
  },
  {
    question: "Who was swallowed by a big fish?",
    options: ["Moses", "Jonah", "Elijah", "Noah"],
    answer: 1,
    fun: "Jonah was in the fish for 3 days and 3 nights — just like Jesus was in the tomb for 3 days before rising!",
  },
  {
    question: "What did God send from the sky to feed the Israelites in the desert?",
    options: ["Fruit", "Grain", "Manna and quail", "Bread and honey"],
    answer: 2,
    fun: "Manna was small, white, and tasted like honey wafers. God sent it fresh every single morning for 40 years!",
  },
  {
    question: "How many commandments did God give Moses?",
    options: ["5", "7", "10", "12"],
    answer: 2,
    fun: "The 10 Commandments are still a great guide for life today — love God and love people!",
  },
  {
    question: "What did baby Jesus sleep in?",
    options: ["A crib", "A manger (feeding trough)", "A basket", "A tent"],
    answer: 1,
    fun: "A manger is a box that holds hay for animals to eat. Jesus came to feed our hearts, just like a manger feeds hungry animals!",
  },
  {
    question: "How many loaves of bread were used to feed 5,000 people?",
    options: ["12 loaves", "2 loaves", "5 loaves", "100 loaves"],
    answer: 2,
    fun: "A small boy shared his lunch of 5 loaves and 2 fish. Jesus multiplied it to feed thousands! Generosity + Jesus = miracles!",
  },
  {
    question: "Who climbed a tree to see Jesus?",
    options: ["Matthew", "Zacchaeus", "Peter", "Nicodemus"],
    answer: 1,
    fun: "Zacchaeus was very short! He climbed a sycamore tree. Jesus noticed him and called him by name — Jesus knows your name too!",
  },
  {
    question: "What happened when Jesus said 'Peace, be still' to the storm?",
    options: [
      "The rain got worse",
      "The disciples fell asleep",
      "The wind and waves calmed immediately",
      "Nothing happened",
    ],
    answer: 2,
    fun: "Even nature obeys Jesus! The disciples asked: 'Who is this that even the wind and waves obey Him?'",
  },
  {
    question: "What is the shortest verse in the Bible?",
    options: [
      '"God is good."',
      '"Jesus wept."',
      '"Pray always."',
      '"Amen."',
    ],
    answer: 1,
    fun: '"Jesus wept" (John 11:35) shows us that Jesus felt real sadness with His friends. He cares about your feelings too!',
  },
];

// ── MEMORY VERSES ─────────────────────────────────────────────────────────────
type VerseTheme = { theme: string; emoji: string; color: string; verses: { ref: string; text: string }[] };

const verseThemes: VerseTheme[] = [
  {
    theme: "God's Love",
    emoji: "❤️",
    color: "#e84060",
    verses: [
      { ref: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
      { ref: "Romans 8:38–39", text: "Neither death nor life... nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord." },
      { ref: "1 John 4:7", text: "Dear friends, let us love one another, for love comes from God." },
    ],
  },
  {
    theme: "Courage & Trust",
    emoji: "🦁",
    color: "#e86030",
    verses: [
      { ref: "Joshua 1:9", text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." },
      { ref: "Psalm 56:3", text: "When I am afraid, I put my trust in you." },
      { ref: "Philippians 4:13", text: "I can do all this through him who gives me strength." },
    ],
  },
  {
    theme: "Praise & Joy",
    emoji: "🎉",
    color: "#f5a030",
    verses: [
      { ref: "Psalm 118:24", text: "This is the day that the Lord has made; let us rejoice and be glad in it." },
      { ref: "Psalm 150:6", text: "Let everything that has breath praise the Lord. Praise the Lord!" },
      { ref: "Philippians 4:4", text: "Rejoice in the Lord always. I will say it again: Rejoice!" },
    ],
  },
  {
    theme: "Wisdom & Truth",
    emoji: "📖",
    color: "#2f7a3b",
    verses: [
      { ref: "Proverbs 3:5–6", text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him." },
      { ref: "Psalm 119:105", text: "Your word is a lamp to my feet and a light to my path." },
      { ref: "James 1:5", text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault." },
    ],
  },
  {
    theme: "Kindness & Others",
    emoji: "🤝",
    color: "#4a90d9",
    verses: [
      { ref: "Ephesians 4:32", text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you." },
      { ref: "Matthew 22:39", text: "Love your neighbor as yourself." },
      { ref: "Colossians 3:20", text: "Children, obey your parents in everything, for this pleases the Lord." },
    ],
  },
];

// ── FUN ZONE ──────────────────────────────────────────────────────────────────
const funActivities = [
  { emoji: "✏️", title: "Drawing Challenge", desc: "Draw your favorite Bible hero from today's story. Add a speech bubble with their most important words." },
  { emoji: "🎭", title: "Act It Out!", desc: "Pick a Bible story and act it out with your family or friends. Who wants to be which character?" },
  { emoji: "🔍", title: "Bible Detective", desc: "Find 5 animals mentioned in the Bible. Hint: look in Genesis, Jonah, and Daniel!" },
  { emoji: "📝", title: "Prayer Journal", desc: "Write down 3 things to thank God for, 2 things to ask God for, and 1 person to pray for by name." },
  { emoji: "🎵", title: "Sing It!", desc: 'Make up a simple song about your favorite Bible verse. Even if it\'s silly — God loves joyful music!' },
  { emoji: "🌍", title: "Map Explorer", desc: "Find Israel on a map. Can you find Bethlehem, Jerusalem, the Jordan River, and the Dead Sea?" },
  { emoji: "🤔", title: "Wonder Questions", desc: "Think about this: Why did Jesus use stories to teach? What's your favorite parable and why?" },
  { emoji: "💌", title: "Letter to God", desc: "Write a letter to God telling Him about your day, your worries, your dreams, and your thanks." },
];

// ── TYPES ─────────────────────────────────────────────────────────────────────
type Tab = "stories" | "quiz" | "verses" | "fun";
type Testament = "all" | "OT" | "NT";

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export function KidsContent({ storyId }: { storyId?: string | null }) {

  const [activeTab, setActiveTab] = useState<Tab>("stories");
  const [testament, setTestament] = useState<Testament>("all");

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const activeStory = useMemo(() => {
    const fallback = stories[0];
    if (!storyId) return fallback;
    return stories.find((s) => s.id === storyId) || fallback;
  }, [storyId]);

  const filteredStories = useMemo(() => {
    if (testament === "all") return stories;
    return stories.filter((s) => s.testament === testament);
  }, [testament]);

  const q = quizQuestions[quizIndex];

  function handleAnswer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function nextQuestion() {
    if (quizIndex + 1 >= quizQuestions.length) {
      setQuizDone(true);
    } else {
      setQuizIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function resetQuiz() {
    setQuizIndex(0);
    setSelected(null);
    setScore(0);
    setQuizDone(false);
  }

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "stories", label: "Bible Stories", emoji: "📖" },
    { id: "quiz", label: "Bible Quiz", emoji: "🧠" },
    { id: "verses", label: "Memory Verses", emoji: "⭐" },
    { id: "fun", label: "Fun Zone", emoji: "🎉" },
  ];

  return (
    <div className="flex flex-col gap-6">
        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-[#2f3b52] text-white shadow-md"
                  : "bg-white text-[#2b241d] border border-[#e7dfd3] hover:border-[#b4894f]"
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* ── STORIES TAB ── */}
        {activeTab === "stories" && (
          <>
            {/* Featured story card */}
            <section className="grid gap-5 md:grid-cols-2">
              {/* Illustration */}
              <div className="flex flex-col items-center justify-center rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(62,54,41,0.10)]">
                {activeStory.image ? (
                  <img
                    src={activeStory.image}
                    alt={`${activeStory.title} illustration`}
                    className="h-52 w-full object-contain"
                  />
                ) : (
                  <div className="flex h-52 w-full items-center justify-center text-8xl">
                    {activeStory.emoji}
                  </div>
                )}
                <p className="mt-3 rounded-xl bg-[#f7f1e7] px-3 py-1.5 text-center text-xs text-[#8b6a3d]">
                  {activeStory.testament === "OT" ? "📜 Old Testament" : "✝️ New Testament"} · {activeStory.book}
                </p>
                <p className="mt-2 text-center text-xs text-[#7a6b5a]">
                  Read together, then say a short prayer. 🙏
                </p>
              </div>

              {/* Story info */}
              <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(62,54,41,0.10)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">Today's story</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#2f3b52]">
                    {activeStory.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#5a534b]">
                    {activeStory.summary}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#2f3b52] px-5 py-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#a8bbd4]">Memory verse</p>
                  <p className="mt-2 text-base font-semibold leading-snug">{activeStory.verse}</p>
                </div>
                <div className="rounded-2xl border border-[#e7dfd3] bg-[#f7f1e7] px-5 py-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#8b6a3d]">Activity</p>
                  <p className="mt-2 text-sm text-[#5a534b]">{activeStory.activity}</p>
                </div>
              </div>
            </section>

            {/* All stories grid */}
            <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(62,54,41,0.10)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">All stories</p>
                  <p className="mt-1 text-sm text-[#5a534b]">
                    {filteredStories.length} stories — tap any one to read it!
                  </p>
                </div>
                <div className="flex gap-2">
                  {(["all", "OT", "NT"] as Testament[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTestament(t)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        testament === t
                          ? "bg-[#2f3b52] text-white"
                          : "bg-[#f7f1e7] text-[#5a534b] hover:bg-[#ede4d5]"
                      }`}
                    >
                      {t === "all" ? "All" : t === "OT" ? "📜 Old" : "✝️ New"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {filteredStories.map((story) => (
                  <a
                    key={story.id}
                    href={`/kids?story=${story.id}`}
                    className={`group flex flex-col items-center rounded-2xl border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
                      activeStory.id === story.id
                        ? "border-[#b4894f] bg-[#f7f1e7]"
                        : "border-[#e7dfd3] bg-[#faf8f4] hover:border-[#b4894f]"
                    }`}
                  >
                    {story.image ? (
                      <img src={story.image} alt={story.title} className="h-12 w-12 object-contain" />
                    ) : (
                      <span className="text-3xl">{story.emoji}</span>
                    )}
                    <p className="mt-2 text-[10px] font-semibold leading-tight text-[#2b241d]">
                      {story.title}
                    </p>
                    <p className="text-[9px] text-[#8b6a3d]">{story.book}</p>
                  </a>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── QUIZ TAB ── */}
        {activeTab === "quiz" && (
          <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(62,54,41,0.10)]">
            {quizDone ? (
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <div className="text-7xl">{score >= 10 ? "🏆" : score >= 7 ? "🌟" : score >= 5 ? "😊" : "📖"}</div>
                <h2 className="text-3xl font-semibold text-[#2f3b52]">
                  You got {score} out of {quizQuestions.length}!
                </h2>
                <p className="text-sm text-[#5a534b]">
                  {score >= 10
                    ? "Amazing! You really know your Bible! 🎉"
                    : score >= 7
                    ? "Great job! Keep reading your Bible every day!"
                    : score >= 5
                    ? "Good effort! Read a story and try again!"
                    : "Keep reading Bible stories — you'll get better every time!"}
                </p>
                <button
                  onClick={resetQuiz}
                  className="rounded-full bg-[#2f3b52] px-6 py-3 font-semibold text-white transition hover:bg-[#3d4e6a]"
                >
                  Play again! 🔄
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">Bible Quiz</p>
                    <p className="mt-1 text-sm text-[#5a534b]">
                      Question {quizIndex + 1} of {quizQuestions.length} · Score: {score} 🌟
                    </p>
                  </div>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-[#f7f1e7]">
                    <div
                      className="h-full rounded-full bg-[#b4894f] transition-all"
                      style={{ width: `${((quizIndex) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-[#2f3b52] px-6 py-5">
                  <p className="text-lg font-semibold leading-snug text-white">
                    🧠 {q.question}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = i === q.answer;
                    let cls =
                      "rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition cursor-pointer ";
                    if (selected === null) {
                      cls += "border-[#e7dfd3] bg-[#faf8f4] hover:border-[#b4894f] hover:bg-[#f7f1e7]";
                    } else if (isCorrect) {
                      cls += "border-green-400 bg-green-50 text-green-800";
                    } else if (isSelected) {
                      cls += "border-red-400 bg-red-50 text-red-800";
                    } else {
                      cls += "border-[#e7dfd3] bg-[#faf8f4] opacity-60";
                    }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} className={cls}>
                        {isSelected && isCorrect && "✅ "}
                        {isSelected && !isCorrect && "❌ "}
                        {!isSelected && selected !== null && isCorrect && "✅ "}
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selected !== null && (
                  <div className="rounded-2xl border border-[#e7dfd3] bg-[#f7f1e7] px-5 py-4">
                    <p className="text-sm font-semibold text-[#2f3b52]">
                      {selected === q.answer ? "🎉 Correct!" : "Not quite!"}
                    </p>
                    <p className="mt-1 text-sm text-[#5a534b]">{q.fun}</p>
                    <button
                      onClick={nextQuestion}
                      className="mt-3 rounded-full bg-[#2f3b52] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#3d4e6a]"
                    >
                      {quizIndex + 1 < quizQuestions.length ? "Next question →" : "See my score! 🏆"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── MEMORY VERSES TAB ── */}
        {activeTab === "verses" && (
          <section className="flex flex-col gap-5">
            <div className="rounded-[28px] bg-[#2f3b52] px-6 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-[#a8bbd4]">Memory Verse Challenge</p>
              <p className="mt-2 text-base font-semibold">
                Learn one verse a week! Say it out loud, write it down, and hide it in your heart. 💙
              </p>
            </div>
            {verseThemes.map((theme) => (
              <div key={theme.theme} className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(62,54,41,0.10)]">
                <p className="flex items-center gap-2 text-lg font-semibold text-[#2f3b52]">
                  <span>{theme.emoji}</span> {theme.theme}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {theme.verses.map((v) => (
                    <div key={v.ref} className="rounded-2xl border border-[#e7dfd3] bg-[#faf8f4] px-5 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.35em]" style={{ color: theme.color }}>
                        {v.ref}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#2b241d]">{v.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── FUN ZONE TAB ── */}
        {activeTab === "fun" && (
          <section className="flex flex-col gap-5">
            <div className="rounded-[28px] bg-[#f5c842] px-6 py-5">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a00]">Fun Zone</p>
              <p className="mt-1 text-xl font-semibold text-[#2b241d]">
                Learn, play, and grow with God! 🎉
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {funActivities.map((act) => (
                <div
                  key={act.title}
                  className="rounded-[22px] bg-white p-5 shadow-[0_16px_40px_rgba(62,54,41,0.10)]"
                >
                  <div className="text-4xl">{act.emoji}</div>
                  <p className="mt-3 text-base font-semibold text-[#2f3b52]">{act.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5a534b]">{act.desc}</p>
                </div>
              ))}
            </div>

            {/* Bible Book Challenge */}
            <div className="rounded-[28px] bg-[#2f3b52] p-6 text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-[#a8bbd4]">Bible Book Challenge</p>
              <p className="mt-2 text-lg font-semibold">How many books are in the Bible?</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
                  <p className="text-3xl font-bold text-[#f5c842]">39</p>
                  <p className="mt-1 text-xs text-[#a8bbd4]">Old Testament books</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
                  <p className="text-3xl font-bold text-[#f5c842]">27</p>
                  <p className="mt-1 text-xs text-[#a8bbd4]">New Testament books</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#cbd7e7]">
                That's <span className="font-bold text-[#f5c842]">66 books</span> total, written by about 40 different people over 1,500 years — but it all tells ONE amazing story about God's love for us! 📖
              </p>
            </div>
          </section>
        )}

        <footer className="text-center text-xs text-[#a8977e]">
          Halo List · Kids Bible Corner · {stories.length} stories
        </footer>
    </div>
  );
}
