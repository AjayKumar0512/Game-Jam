# search_dir=../res/retina/final_art
# for entry in "$search_dir"/*
# do
#     for tempEntry in "$entry"/Final_Vector/coloured_art/*
#     do
#         file_name="$(basename "$tempEntry")"
#         d="${#file_name}"
#         len="$((d - 4))"
#         echo "${file_name:0:len}"_colured_art:\""$tempEntry"\",
#     done
# done

search_dir=../res/sounds/mp3/voice-overs/category_voice_over
for entry in "$search_dir"/*
do
    for tempEntry in "$entry"/*
    do
        file_name="$(basename "$tempEntry")"
        d="${#file_name}"
        len="$((d - 4))"
        echo "${file_name:0:len}"_mp3:\""$tempEntry"\",
    done
done