#!/bin/bash


let arr=("2023-01-12" "2023-02-04" "2023-02-05" "2023-02-17" "2023-03-10" "2023-04-09" "2023-04-15" "2023-04-28" "2023-05-04" "2023-05-26" "2023-06-17" "2023-06-27" "2023-06-30" "2023-07-13" "2023-07-30" "2023-10-29" "2023-10-30" "2023-10-31" "2023-11-01" "2023-11-02" "2023-11-03" "2023-11-10" "2023-11-14" "2023-11-22" "2024-01-22" "2024-02-22" "2024-02-22" "2024-03-30" "2024-04-01" "2024-05-21")

# echo "All elements of the array:"
# echo "${arr[@]}"
# echo "${arr[*]}"

#echo "${arr[1]}"


iteratorDate="2023-07-31"
search=$(echo "${arr[@]}" | grep -c $iteratorDate)
#echo "Search result for 'Jayesh': $search"

#echo $search
while [ $(echo "${arr[@]}" | grep -c $iteratorDate) -gt 0 ]
do
	iteratorDate=$(date '+%Y-%m-%d' -d "$iteratorDate + 1 day")
	beginDateCommit=$(date -d $iteratorDate +%s)
done


echo $iteratorDate
echo $beginDateCommit

#search=$(echo "${arr[@]}" | grep -o -e "Jayes" -e "Vipul" -e "there" | wc -l)
#echo "Search result for 'Jayesh': $search"